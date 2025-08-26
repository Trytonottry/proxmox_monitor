// src/monitor.rs
use super::client::ProxmoxClient;
use super::models::{Node, VirtualMachine};

pub async fn check_nodes(client: &ProxmoxClient) -> Result<Vec<Node>, anyhow::Error> {
    client.get_nodes().await
}

pub async fn check_vms(client: &ProxmoxClient, node: &str) -> Result<Vec<VirtualMachine>, anyhow::Error> {
    client.get_vms(node).await
}