# 🛠️ proxmox-monitor

**CLI и библиотека для мониторинга Proxmox VE на Rust** — быстрый, безопасный и современный инструмент для DevOps и системных администраторов.

![Rust](https://img.shields.io/badge/Rust-1.70%2B-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Особенности

- ⚡ Написан на Rust — высокая производительность, безопасность
- 📦 CLI для проверки узлов и виртуальных машин
- 🔐 Поддержка аутентификации через логин/пароль
- 📚 Можно использовать как библиотеку в других проектах
- 🐳 Лёгкий бинарник — подходит для CI/CD и автоматизации

## 🚀 Установка

### Через `cargo`

```bash
cargo install --git https://github.com/Trytonottry/proxmox_monitor
```

### Из исходников
```bash
git clone https://github.com/Trytonottry/proxmox_monitor.git
cd proxmox_monitor
cargo run -- --host https://pve.example.com:8006 --user monitor@pve --password secret --action nodes
```
## ▶️ Примеры
```bash
# Показать узлы
proxmox-monitor --host https://192.168.1.100:8006 --user api@pve --password xxx --action nodes

# Показать виртуальные машины
proxmox-monitor --host https://192.168.1.100:8006 --user api@pve --password xxx --action vms
```
## 📄 Лицензия 

MIT — можно использовать в коммерческих проектах. 
