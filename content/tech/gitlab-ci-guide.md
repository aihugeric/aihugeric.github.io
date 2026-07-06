---
title: GitLab CI/CD 从入门到精通
date: 2026-07-01
author: ericxi
category: tech
tags: [GitLab, CI/CD, DevOps, 自动化]
excerpt: 详解 GitLab CI/CD 流水线配置，实现自动化构建、测试与部署。
---

# GitLab CI/CD 从入门到精通

## CI/CD 是什么

- **持续集成（CI）**：频繁将代码合并到主干，自动构建和测试
- **持续交付（CD）**：自动将代码部署到测试/生产环境

## GitLab CI 核心概念

### Pipeline

一次完整的 CI/CD 流程，由多个 Stage 组成。

### Stage

流水线阶段，如 `build`、`test`、`deploy`。同一 Stage 中的 Job 可并行执行。

### Job

Stage 中的具体任务，由 Runner 执行。

### Runner

执行 Job 的代理程序，可以是共享 Runner 或私有 Runner。

## .gitlab-ci.yml 基础

```yaml
# 定义阶段顺序
stages:
  - build
  - test
  - deploy

# 构建 Job
build:
  stage: build
  image: node:22
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# 测试 Job
test:
  stage: test
  image: node:22
  script:
    - npm ci
    - npm test
  dependencies:
    - build

# 部署 Job
deploy:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying..."
  only:
    - main
```

## 高级用法

### 条件执行

```yaml
deploy-production:
  stage: deploy
  script: ./deploy.sh
  only:
    - main
  when: manual  # 手动触发
```

### 环境变量

```yaml
variables:
  NODE_ENV: production

deploy:
  script:
    - echo "Deploying to $DEPLOY_TARGET"
  variables:
    DEPLOY_TARGET: production
```

### 缓存依赖

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

## 部署到 GitLab Pages

```yaml
pages:
  stage: deploy
  image: node:22
  script:
    - npm ci
    - npm run build
    - mkdir -p public
    - cp -r dist/* public/
  artifacts:
    paths:
      - public
  only:
    - main
```

## 小结

GitLab CI/CD 提供了强大而灵活的流水线配置能力，与 GitLab 仓库深度集成，是个人项目和团队协作的首选 CI/CD 方案。
