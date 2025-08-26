// src/client.rs
use reqwest::Client;
use serde_json::Value;
use std::collections::HashMap;
use once_cell::sync::Lazy;
use anyhow::{Result, Context};

static CLIENT: Lazy<Client> = Lazy::new(|| Client::new());

pub struct ProxmoxClient {
    base_url: String,
    ticket: String,
    csrf: Option<String>,
}

impl ProxmoxClient {
    pub async fn new(host: &str, user: &str, password: &str) -> Result<Self> {
        let login_url = format!("{}/api2/json/access/ticket", host.trim_end_matches('/'));
        let mut form = HashMap::new();
        form.insert("username", user);
        form.insert("password", password);

        let resp: Value = CLIENT
            .post(&login_url)
            .form(&form)
            .send()
            .await
            .context("Failed to connect to Proxmox API")?
            .json()
            .await
            .context("Failed to parse login response")?;

        let data = resp["data"].as_object().context("No data in response")?;
        let ticket = data["ticket"]
            .as_str()
            .context("No ticket in response")?
            .to_string();
        let csrf = data["CSRFPreventionToken"].as_str().map(|s| s.to_string());

        Ok(Self {
            base_url: format!("{}/api2/json", host.trim_end_matches('/')),
            ticket,
            csrf,
        })
    }

    pub async fn get_nodes(&self) -> Result<Vec<super::models::Node>> {
        let url = format!("{}/nodes", self.base_url);
        let resp: Value = CLIENT
            .get(&url)
            .header("Cookie", format!("PVEAuthCookie={}", self.ticket))
            .send()
            .await?
            .json()
            .await?;

        Ok(serde_json::from_value(resp["data"].clone())?)
    }

    pub async fn get_vms(&self, node: &str) -> Result<Vec<super::models::VirtualMachine>> {
        let url = format!("{}/nodes/{}/qemu", self.base_url, node);
        let resp: Value = CLIENT
            .get(&url)
            .header("Cookie", format!("PVEAuthCookie={}", self.ticket))
            .send()
            .await?
            .json()
            .await?;

        Ok(serde_json::from_value(resp["data"].clone())?)
    }
}