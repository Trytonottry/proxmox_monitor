# Changelog

## v0.1.0 (2025-04-05)

### ✨ Новые возможности
- CLI для мониторинга узлов и ВМ в Proxmox
- Prometheus Exporter для сбора метрик
- Поддержка Docker и Helm
- Grafana Dashboard
- Alerting Rules для Prometheus
- Полная документация

### 🐛 Исправления
- Улучшена стабильность подключения к Proxmox API
- Исправлены утечки памяти в экспортере

### 📦 Установка

```bash
# CLI
cargo install --git https://github.com/Trytonottry/proxmox_monitor

# Или через Docker
docker run ghcr.io/trytonottry/proxmox-monitor:latest --help