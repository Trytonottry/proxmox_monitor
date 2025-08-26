# Установка CLI

## Через Cargo (рекомендуется)

```bash
cargo install --git https://github.com/Trytonottry/proxmox_monitor
```

## Из исходников
```bash
git clone https://github.com/Trytonottry/proxmox_monitor.git
cd proxmox_monitor
cargo install --path .
```

## Через Docker
```bash
docker run --rm ghcr.io/trytonottry/proxmox-monitor:latest --help
```

## Требования 

    Rust 1.70+
    Доступ к API Proxmox (порт 8006)
     