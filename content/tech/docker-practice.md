---
title: Docker 容器化实践指南
date: 2026-07-05
author: ericxi
category: tech
tags: [Docker, 容器化, DevOps, 部署]
excerpt: 深入理解 Docker 的核心概念，掌握容器化部署的最佳实践。
---

# Docker 容器化实践指南

## 什么是 Docker

Docker 是一个开源的容器化平台，它允许开发者将应用及其依赖打包到一个轻量级、可移植的容器中，然后在任何支持 Docker 的环境中运行。

## 核心概念

### 镜像（Image）

镜像是容器的蓝图，包含运行应用所需的一切：

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 容器（Container）

容器是镜像的运行实例，相互隔离：

```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -d -p 3000:3000 --name app my-app
```

### 数据卷（Volume）

持久化存储，容器重启后数据不丢失：

```bash
docker run -d \
  -v /host/data:/container/data \
  --name db mysql:8
```

### 网络（Network）

容器间通信：

```bash
# 创建自定义网络
docker network create app-network

# 在同一网络中运行容器
docker run -d --network app-network --name api my-api
docker run -d --network app-network --name db mysql:8
```

## Docker Compose

多容器应用编排：

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

volumes:
  pgdata:
```

```bash
docker compose up -d
```

## 最佳实践

### 1. 减小镜像体积

- 使用 `alpine` 基础镜像
- 多阶段构建
- 清理缓存文件

```dockerfile
# 多阶段构建示例
FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 2. 安全加固

- 不要以 root 用户运行
- 定期更新基础镜像
- 扫描镜像漏洞

### 3. 日志管理

- 输出到 stdout/stderr
- 使用日志驱动
- 配置日志轮转

## 小结

Docker 让应用的构建、分发和运行变得简单一致。掌握这些核心概念和最佳实践，可以显著提升开发效率和部署可靠性。
