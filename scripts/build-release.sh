#!/bin/bash
# scripts/build-release.sh

set -e
echo "📦 Сборка релиза v0.1.0 через cross..."

mkdir -p dist

# Убедимся, что cross установлен
if ! command -v cross &> /dev/null; then
    echo "❌ cross не установлен. Выполни: cargo install cross"
    exit 1
fi

# Сборка через cross
echo "🛠️ Сборка под Linux x86_64 (musl)"
cross build --target x86_64-unknown-linux-musl --release

echo "🛠️ Сборка под macOS x86_64"
cross build --target x86_64-apple-darwin --release

echo "🛠️ Сборка под macOS aarch64 (Apple Silicon)"
cross build --target aarch64-apple-darwin --release

echo "🛠️ Сборка под Windows x86_64"
cross build --target x86_64-pc-windows-msvc --release

# Копируем
cp target/x86_64-unknown-linux-musl/release/proxmox_monitor dist/proxmox-monitor-linux-x64
cp target/x86_64-apple-darwin/release/proxmox_monitor dist/proxmox-monitor-macos-x64
cp target/aarch64-apple-darwin/release/proxmox_monitor dist/proxmox-monitor-macos-arm64
cp target/x86_64-pc-windows-msvc/release/proxmox_monitor.exe dist/proxmox-monitor-windows-x64.exe

# Архивируем
cd dist
zip ../proxmox-monitor-v0.1.0.zip *
cd ..

echo "✅ Релиз готов: proxmox-monitor-v0.1.0.zip"