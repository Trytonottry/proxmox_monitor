# 🚨 Prometheus Alerting Rules for Proxmox

Эти правила предупреждают о критических состояниях в Proxmox-кластере.

## 📌 Как использовать

1. Положи файл `proxmox.rules.yml` в директорию с правилами Prometheus.
2. Добавь в `prometheus.yml`:

```yaml
rule_files:
  - "alerts/proxmox.rules.yml"

# Или с reload:
# - "alerts/*.rules.yml"
```
3. Перезапусти Prometheus или отправь POST /-/reload.
     

## 📣 Severity 

    critical — требует немедленного вмешательства
    warning — внимание, может ухудшиться
     

## 🔄 Reload без перезапуска 
```bash
curl -X POST http://localhost:9090/-/reload
```

