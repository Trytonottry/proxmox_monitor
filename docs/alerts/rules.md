# Alerting Rules

Правила для `Prometheus` — чтобы получать уведомления о проблемах.

## Установка

Добавь в `prometheus.yml`:

```yaml
rule_files:
  - "alerts/proxmox.rules.yml"
```

И перезагрузи:
```bash
curl -X POST http://localhost:9090/-/reload
```

### Доступные алерты
Алерт                             Условие               Severity
ProxmoxNodeHighCpuUsage           CPU > 80%             warning
ProxmoxNodeHighMemoryUsage        RAM > 85%             warning
ProxmoxVmDown                     VM stopped            critical
ProxmoxNodeMissingMetrics         Нет метрик 2+ мин     critical