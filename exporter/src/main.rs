// exporter/src/main.rs
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response, Server, StatusCode};
use prometheus::{Encoder, IntGauge, IntGaugeVec, TextEncoder};
use serde::Deserialize;
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Mutex;
use once_cell::sync::Lazy;

// --- Prometheus метрики ---
static NODE_CPU: Lazy<IntGaugeVec> = Lazy::new(|| {
    IntGaugeVec::new(
        "proxmox_node_cpu_usage_percent",
        "CPU usage of Proxmox node in percent",
        &["node"]
    ).unwrap()
});

static NODE_MEMORY: Lazy<IntGaugeVec> = Lazy::new(|| {
    IntGaugeVec::new(
        "proxmox_node_memory_usage_bytes",
        "Memory usage of Proxmox node",
        &["node"]
    ).unwrap()
});

static VM_STATUS: Lazy<IntGaugeVec> = Lazy::new(|| {
    IntGaugeVec::new(
        "proxmox_vm_status",
        "Status of VM (1 = running, 0 = stopped)",
        &["node", "vmid", "name"]
    ).unwrap()
});

// --- Proxmox API модели ---
#[derive(Deserialize, Debug)]
struct ProxmoxNode {
    node: String,
    status: String,
    cpu: f64,
    #[serde(rename = "maxcpu")]
    maxcpu: u32,
    mem: u64,
    #[serde(rename = "maxmem")]
    maxmem: u64,
}

#[derive(Deserialize, Debug)]
struct VirtualMachine {
    vmid: u32,
    name: String,
    status: String,
}

// --- Proxmox клиент ---
struct ProxmoxClient {
    base_url: String,
    ticket: String,
}

impl ProxmoxClient {
    async fn new(host: &str, user: &str, password: &str) -> Result<Self, anyhow::Error> {
        let client = reqwest::Client::new();
        let login_url = format!("{}/api2/json/access/ticket", host);
        let mut form = HashMap::new();
        form.insert("username", user);
        form.insert("password", password);

        let resp: serde_json::Value = client
            .post(&login_url)
            .form(&form)
            .send()
            .await?
            .json()
            .await?;

        let ticket = resp["data"]["ticket"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("No ticket"))?;

        Ok(Self {
            base_url: format!("{}/api2/json", host),
            ticket: ticket.to_string(),
        })
    }

    async fn get_nodes(&self) -> Result<Vec<ProxmoxNode>, anyhow::Error> {
        let url = format!("{}/nodes", self.base_url);
        let client = reqwest::Client::new();
        let resp: serde_json::Value = client
            .get(&url)
            .header("Cookie", format!("PVEAuthCookie={}", self.ticket))
            .send()
            .await?
            .json()
            .await?;

        Ok(serde_json::from_value(resp["data"].clone())?)
    }

    async fn get_vms(&self, node: &str) -> Result<Vec<VirtualMachine>, anyhow::Error> {
        let url = format!("{}/nodes/{}/qemu", self.base_url, node);
        let client = reqwest::Client::new();
        let resp: serde_json::Value = client
            .get(&url)
            .header("Cookie", format!("PVEAuthCookie={}", self.ticket))
            .send()
            .await?
            .json()
            .await?;

        Ok(serde_json::from_value(resp["data"].clone())?)
    }
}

// --- Сбор метрик ---
async fn collect_metrics(
    host: &str,
    user: &str,
    password: &str,
) -> Result<(), anyhow::Error> {
    let client = ProxmoxClient::new(host, user, password).await?;
    let nodes = client.get_nodes().await?;

    for node in &nodes {
        NODE_CPU
            .with_label_values(&[&node.node])
            .set((node.cpu * 100.0) as i64);
        NODE_MEMORY
            .with_label_values(&[&node.node])
            .set(node.mem as i64);
    }

    for node in &nodes {
        let vms = client.get_vms(&node.node).await?;
        for vm in vms {
            VM_STATUS
                .with_label_values(&[&node.node, &vm.vmid.to_string(), &vm.name])
                .set(if vm.status == "running" { 1 } else { 0 });
        }
    }

    Ok(())
}

// --- HTTP сервер ---
async fn handle_request(_req: Request<Body>) -> Result<Response<Body>, hyper::Error> {
    let mut buffer = vec![];
    let encoder = TextEncoder::new();
    let metric_families = prometheus::gather();
    encoder.encode(&metric_families, &mut buffer).unwrap();

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/plain")
        .body(Body::from(buffer))
        .unwrap())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr: SocketAddr = ([0, 0, 0, 0], 9090).into();

    // Конфигурация
    let host = std::env::var("PROXMOX_HOST").expect("PROXMOX_HOST not set");
    let user = std::env::var("PROXMOX_USER").expect("PROXMOX_USER not set");
    let password = std::env::var("PROXMOX_PASSWORD").expect("PROXMOX_PASSWORD not set");

    // Запуск HTTP сервера
    let make_svc = make_service_fn(|_conn| async {
        Ok::<_, hyper::Error>(service_fn(handle_request))
    });

    let server = Server::bind(&addr).serve(make_svc);

    println!("🚀 Proxmox Exporter запущен на http://{}:{}/metrics", addr.ip(), addr.port());

    // Фоновое обновление метрик
    tokio::spawn(async move {
        loop {
            if let Err(e) = collect_metrics(&host, &user, &password).await {
                eprintln!("Ошибка сбора метрик: {}", e);
            }
            tokio::time::sleep(tokio::time::Duration::from_secs(30)).await;
        }
    });

    server.await?;
    Ok(())
}