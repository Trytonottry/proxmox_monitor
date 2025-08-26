// src/cli.rs
use clap::Parser;

#[derive(Parser)]
#[command(name = "proxmox-monitor")]
#[command(about = "CLI для мониторинга Proxmox VE", long_about = None)]
pub struct Cli {
    #[arg(short, long)]
    pub host: String,

    #[arg(short, long)]
    pub user: String,

    #[arg(short, long)]
    pub password: String,

    #[arg(short, long, default_value = "nodes")]
    pub action: String,
}