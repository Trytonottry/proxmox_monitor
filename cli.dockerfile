# Сборка бинарника
FROM rust:1.78-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache musl-dev
RUN cargo build --release

# Финальный образ
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/target/release/proxmox-monitor /usr/local/bin/proxmox-monitor

CMD ["proxmox-monitor"]