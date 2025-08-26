#!/bin/bash
# scripts/build-release-linux.sh

set -e
echo "📦 Сборка только для Linux (x86_64-unknown-linux-musl)..."

# Убедимся, что нужный таргет установлен
rustup target add x86_64-unknown-linux-musl

# Сборка
cargo build --target x86_64-unknown-linux-musl --release

# Создаём папку
mkdir -p dist

# Копируем (обрати внимание: cargo использует _ вместо -)
cp target/x86_64-unknown-linux-musl/release/proxmox_monitor dist/proxmox-monitor-linux-x64

# Делаем исполняемым
chmod +x dist/proxmox-monitor-linux-x64

# Архивируем
cd dist
zip ../proxmox-monitor-linux-v0.1.0.zip proxmox-monitor-linux-x64
cd ..

echo "✅ Сборка завершена: proxmox-monitor-linux-v0.1.0.zip"
echo "➡️ Размер: $(ls -lh proxmox-monitor-linux-v0.1.0.zip | awk '{print $5}')"