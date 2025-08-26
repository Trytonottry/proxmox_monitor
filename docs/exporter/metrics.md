# Экспортируемые метрики

`proxmox-exporter` предоставляет следующие метрики:

## `proxmox_node_cpu_usage_percent`

- Описание: Загрузка CPU узла в процентах
- Метки: `node`
- Пример: `proxmox_node_cpu_usage_percent{node="pve1"}`

## `proxmox_node_memory_usage_bytes`

- Описание: Использование памяти узлом
- Метки: `node`

## `proxmox_vm_status`

- Описание: Статус ВМ (1 = running, 0 = stopped)
- Метки: `node`, `vmid`, `name`

## Пример запроса в Prometheus

```promql
# Средняя загрузка CPU по узлам
avg by (node) (proxmox_node_cpu_usage_percent)

# Количество запущенных ВМ
count(proxmox_vm_status == 1)