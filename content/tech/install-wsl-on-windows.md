---
title: Windows 离线安装 WSL 指南
date: 2026-07-13
author: ericxi
category: tech
tags: [WSL]
excerpt: WSL（Windows Subsystem for Linux）是 Windows 内置的 Linux 兼容层，让你无需虚拟机或双系统就能在 Windows 上原生运行 Linux 命令行、工具和应用。**
---

# Windows 离线安装 WSL 指南
## 用途说明
WSL（Windows Subsystem for Linux）是 Windows 内置的 Linux 兼容层，让你无需虚拟机或双系统就能在 Windows 上原生运行 Linux 命令行、工具和应用。
## 你需要准备的东西

| 文件 | 说明 | 大小 |
|------|------|------|
| WSL2 内核更新包 | `wsl_update_x64.msi` | ~15MB |
| Ubuntu WSL 镜像 | `noble-wsl-amd64.wsl` | ~500MB |

这两个文件需要在**有网的机器**上下载好，再拷贝到目标机器。

---

## 第一步：下载离线安装包（在有网的机器上）

### 1.1 下载 WSL2 内核

```
https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
```

### 1.2 下载 Ubuntu WSL 镜像

```
https://cdimages.ubuntu.com/ubuntu-wsl/noble/daily-live/current/noble-wsl-amd64.wsl
```

> `.wsl` 文件本质上是一个包含 `rootfs.tar.gz` 的压缩包，可以直接用 `wsl --import` 导入。

---

## 第二步：启用 Windows 功能（目标机器上）

以**管理员身份**打开 PowerShell，逐条执行：

```powershell
# 启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台（WSL2 需要）
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**重启电脑。**

---

## 第三步：安装 WSL2 内核

在目标机器上双击运行 `wsl_update_x64.msi` 完成安装。

---

## 第四步：导入 Ubuntu WSL 镜像

```powershell
# 创建 WSL 存放目录
mkdir D:\WSL\Ubuntu-2404

# 导入 .wsl 镜像文件
wsl --import Ubuntu-2404 D:\WSL\Ubuntu-2404 D:\下载目录\noble-wsl-amd64.wsl --version 2
```

参数说明：

| 参数 | 含义 |
|------|------|
| `Ubuntu-2404` | 发行版名称，可自定义 |
| `D:\WSL\Ubuntu-2404` | 虚拟磁盘存放位置 |
| `D:\下载目录\noble-wsl-amd64.wsl` | 镜像文件路径 |
| `--version 2` | 使用 WSL2 |

---

## 第五步：设置 WSL2 为默认

```powershell
wsl --set-default-version 2
```

验证：

```powershell
wsl --version
wsl -l -v
```

`VERSION` 列显示 `2` 即成功。

---

## 设置默认用户

`wsl --import` 导入后默认以 **root** 登录。创建普通用户并设为默认：

```bash
# 在 WSL 里执行
useradd -m -s /bin/bash 你的用户名
passwd 你的用户名
usermod -aG sudo 你的用户名
```

```powershell
# 回到 PowerShell，设置默认用户
ubuntu2404 config --default-user 你的用户名
```

---

## 进入 WSL

```powershell
wsl -d Ubuntu-2404
```

---

## 常见问题

**Q: 提示"请启用虚拟机平台 Windows 功能"？**

确保 BIOS 中开启了虚拟化（Intel VT-x / AMD-V），然后已执行第二步的 `VirtualMachinePlatform` 启用命令并重启。

**Q: WSL2 内核 MSI 装不上？**

检查 CPU 是否支持二级地址转换（SLAT），老款 CPU 可能只能跑 WSL1。可以用以下命令降级：

```powershell
wsl --set-version Ubuntu-2404 1
```

**Q: `.wsl` 文件报错无法导入？**

确保 WSL2 内核已正确安装。也可以尝试将 `.wsl` 文件改名为 `.zip` 解压，用解压出的 `rootfs.tar.gz` 导入：

```powershell
wsl --import Ubuntu-2404 D:\WSL\Ubuntu-2404 D:\解压目录\rootfs.tar.gz --version 2
```
