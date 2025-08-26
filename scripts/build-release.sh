#!/bin/bash
# scripts/build-release.sh

set -e

echo "📦 Сборка релиза v0.1.0..."

# Создаём папку
mkdir -p dist

# Linux x64
echo "🛠️ Сборка Linux x64"
cargo build --release --target x86_64-unknown-linux-musl
cp target/x86_64-unknown-linux-musl/release/proxmox-monitor dist/proxmox-monitor-linux-x64

# macOS x64
echo "🛠️ Сборка macOS x64"
cargo build --release --target x86_64-apple-darwin
cp target/x86_64-apple-darwin/release/proxmox-monitor dist/proxmox-monitor-macos-x64

# macOS ARM64
echo "🛠️ Сборка macOS ARM64"
cargo build --release --target aarch64-apple-darwin
cp target/aarch64-apple-darwin/release/proxmox-monitor dist/proxmox-monitor-macos-arm64

# Windows x64
echo "🛠️ Сборка Windows x64"
cargo build --release --target x86_64-pc-windows-msvc
cp target/x86_64-pc-windows-msvc/release/proxmox-monitor.exe dist/proxmox-monitor-windows-x64.exe

# Архивируем
cd dist
zip ../proxmox-monitor-v0.1.0.zip *
cd ..

echo "✅ Релиз готов: proxmox-monitor-v0.1.0.zip"