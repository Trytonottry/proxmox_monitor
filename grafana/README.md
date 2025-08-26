# 📊 Grafana Dashboard for Proxmox Monitor

Этот дашборд показывает метрики, собранные с помощью [proxmox-exporter](https://github.com/Trytonottry/proxmox_monitor).

## 📌 Метрики

- `proxmox_node_cpu_usage_percent` — загрузка CPU по узлам
- `proxmox_node_memory_usage_bytes` — использование памяти
- `proxmox_vm_status` — статус ВМ (1 = running, 0 = stopped)

## 🚀 Как импортировать

1. Открой Grafana
2. Перейди: **Dashboard → Import**
3. Загрузи файл `proxmox-dashboard.json`
4. Выбери свой Prometheus как источник данных
5. Готово!

## 🖼️ Превью

![Dashboard Preview](https://i.imgur.com/5X6zK9l.png)

> Скриншот можно заменить на реальный после настройки.