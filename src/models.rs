// src/models.rs
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Node {
    pub node: String,
    pub status: String,
    #[serde(default)]
    pub cpu: f64,
    #[serde(rename = "maxcpu")]
    pub max_cpu: u32,
    #[serde(default)]
    pub mem: u64,
    #[serde(rename = "maxmem")]
    pub max_mem: u64,
    #[serde(default)]
    pub uptime: u64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct VirtualMachine {
    pub vmid: u32,
    pub name: String,
    pub status: String,
    #[serde(default)]
    pub cpu: f64,
    #[serde(default)]
    pub mem: u64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Container {
    pub vmid: u32,
    pub name: String,
    pub status: String,
    #[serde(default)]
    pub cpu: f64,
    #[serde(default)]
    pub mem: u64,
}