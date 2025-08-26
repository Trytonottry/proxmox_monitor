// src/main.rs
use clap::Parser;
use proxmox_monitor::{cli::Cli, client::ProxmoxClient, monitor};

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let cli = Cli::parse();

    let client = ProxmoxClient::new(&cli.host, &cli.user, &cli.password).await?;

    match cli.action.as_str() {
        "nodes" => {
            let nodes = monitor::check_nodes(&client).await?;
            println!("{:<15} {:<10} {:<10} {:<10}", "Node", "Status", "CPU", "RAM (GB)");
            for node in nodes {
                let ram_gb = node.mem as f64 / 1e9;
                println!("{:<15} {:<10} {:<10.2} {:<10.2}", 
                    node.node, node.status, node.cpu * 100.0, ram_gb);
            }
        }
        "vms" => {
            let nodes = monitor::check_nodes(&client).await?;
            for node in nodes {
                let vms = monitor::check_vms(&client, &node.node).await?;
                println!("\n--- VMs on {} ---", node.node);
                for vm in vms {
                    let ram_gb = vm.mem as f64 / 1e9;
                    println!("VMID: {}, Name: {}, Status: {}, CPU: {:.2}%, RAM: {:.2} GB",
                        vm.vmid, vm.name, vm.status, vm.cpu * 100.0, ram_gb);
                }
            }
        }
        _ => eprintln!("Unknown action: {}", cli.action),
    }

    Ok(())
}