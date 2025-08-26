# Сборка
FROM rust:1.78-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache musl-dev
RUN cargo build --release

# Финальный образ
FROM scratch
COPY --from=builder /app/target/release/proxmox-exporter /proxmox-exporter
EXPOSE 9090
CMD ["/proxmox-exporter"]