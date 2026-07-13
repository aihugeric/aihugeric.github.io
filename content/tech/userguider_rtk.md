---
title: AI省token工具RTK安装使用帮助
date: 2026-07-13
author: ericxi
category: tech
tags: [RTK、 Token]
excerpt: 性能 CLI 代理工具，能将 AI 编程工具的 Token 消耗降低 **60%-90%**
---

# RTK (Rust Token Killer) 安装使用帮助

> **版本：v0.42.4** | 语言：Rust | 许可：Apache 2.0  
> RTK 是一个高性能 CLI 代理工具，能将 AI 编程工具的 Token 消耗降低 **60%-90%**。  
> 零运行时依赖，单一二进制文件，开销 < 10ms。

---

## 一、工作原理

RTK 拦截 AI 工具执行的 Shell 命令（如 `ls`、`cat`、`git status`、`cargo test`），对输出执行四种策略后再返回给 LLM：

| 策略 | 示例 |
|------|------|
| **智能过滤** | 去除注释、空行、样板代码 |
| **分组聚合** | 按目录归并文件列表、按类型归并错误 |
| **截断** | 保留上下文，去除冗余 |
| **去重** | 合并重复日志行并添加计数 |

```
无 RTK:   Claude → git status → 输出 2000 token → Claude
有 RTK:   Claude → rtk git status → 过滤 → 输出 200 token → Claude  (省 90%)
```

---

## 二、安装

### Windows（原生，推荐）

自 v0.37.2 起完整支持原生 Windows，无需 WSL：

```powershell
# 1. 从 GitHub Releases 下载
#    https://github.com/rtk-ai/rtk/releases
#    下载文件：rtk-x86_64-pc-windows-msvc.zip

# 2. 解压后，将 rtk.exe 放到 PATH 中的目录
#    例如：C:\Users\<你的用户名>\.local\bin\
#    确保该目录在系统环境变量 PATH 中

# 3. （建议）安装 ripgrep，部分过滤器需要
winget install BurntSushi.ripgrep.MSVC
```

> ⚠️ 不要双击 `rtk.exe`！它必须在 **PowerShell** 或 **命令提示符** 中运行。

### Windows（WSL）

```bash
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

### macOS

```bash
# 方式一：Homebrew（推荐）
brew install rtk

# 方式二：一键脚本
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

### Linux

```bash
# 一键脚本
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# 确保 ~/.local/bin 在 PATH 中
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 验证安装

```bash
rtk --version    # 应显示：rtk 0.42.4
rtk gain         # 应显示 Token 节省统计
```

> 如果 `rtk gain` 报错，可能是装成了 crates.io 上的同名项目（Rust Type Kit），请卸载后重新用上述方式安装。

---

## 三、接入 AI 工具

安装完成后，一条命令注册到 AI 工具即可：

| 工具 | 命令 |
|------|------|
| **Claude Code** | `rtk init -g` |
| **GitHub Copilot** | `rtk init -g --copilot` |
| **Cursor** | `rtk init -g --agent cursor` |
| **Gemini CLI** | `rtk init -g --gemini` |
| **Codex (OpenAI)** | `rtk init -g --codex` |
| **Windsurf** | `rtk init -g --agent windsurf` |
| **Cline / Roo Code** | `rtk init --agent cline` |
| **OpenCode** | `rtk init -g --opencode` |
| **Kilo Code** | `rtk init --agent kilocode` |
| **Antigravity** | `rtk init --agent antigravity` |
| **Factory Droid** | `rtk init -g --agent droid` |

初始化后**重启 AI 工具即可生效**，无需改变任何工作习惯。

### 卸载

```bash
rtk init -g --uninstall
```

---

## 四、使用方式

### 自动模式（推荐）

初始化后，你所执行的各种命令会被自动拦截并重写。例如：

```bash
# 你在 AI 工具中输入 →  实际执行
git status              →  rtk git status
ls -la                  →  rtk ls -la
cat src/main.rs         →  rtk read src/main.rs
grep "TODO" .           →  rtk grep "TODO" .
cargo test              →  rtk cargo test
npm run test            →  rtk npm run test
pytest                  →  rtk pytest
docker ps               →  rtk docker ps
```

这一切对你是**透明**的，你只管像往常一样工作。

### 手动调用

也可以在任何终端直接调用 RTK 命令：

```bash
rtk git status
rtk read app.js
rtk find "*.rs" src/
rtk grep "pattern" .
rtk cargo test
rtk pytest
rtk docker logs my-container
rtk gh pr list
rtk aws ec2 describe-instances
```

### 全局标志

| 标志 | 说明 |
|------|------|
| `-u, --ultra-compact` | 极致压缩，额外节省 Token |
| `-v, --verbose` | 增加输出详细程度（`-v` / `-vv` / `-vvv`） |

---

## 五、查看节省效果

```bash
rtk gain               # 汇总统计
rtk gain --history      # 最近命令历史
rtk gain --daily        # 逐日明细
rtk gain --graph        # ASCII 图表（最近 30 天）
rtk gain --all --format json  # JSON 导出
```

示例输出：

```
命令执行: 145 条
原始 Token: 118,000
实际输出: 23,900
节省: 94,100 token (79.7%)
```

### 发现优化机会

```bash
rtk discover                 # 当前项目未覆盖的命令
rtk discover --all --since 7 # 所有项目，最近 7 天
```

---

## 六、支持的命令速查

### 文件操作
| 命令 | 说明 | 节省比 |
|------|------|--------|
| `rtk ls` | 优化目录树 | -80% |
| `rtk read <file>` | 智能文件读取 | -70% |
| `rtk read <file> -l aggressive` | 仅保留函数签名 | -90% |
| `rtk find "*.rs" .` | 紧凑查找结果 | -80% |
| `rtk grep "pattern" .` | 分组搜索结果 | -80% |
| `rtk diff a b` | 精简 diff | -75% |

### Git
| 命令 | 说明 | 节省比 |
|------|------|--------|
| `rtk git status` | 紧凑状态 | -80% |
| `rtk git log -n 10` | 单行提交 | -80% |
| `rtk git diff` | 精简 diff | -75% |
| `rtk git add` | → "ok" | -92% |
| `rtk git commit -m "msg"` | → "ok abc1234" | -92% |
| `rtk git push` | → "ok main" | -90% |

### 测试
| 命令 | 节省比 |
|------|--------|
| `rtk pytest` | -90% |
| `rtk cargo test` | -90% |
| `rtk go test` | -90% |
| `rtk jest` / `rtk vitest` | 仅失败用例 |
| `rtk npm test` | -90% |

### 构建 & Lint
| 命令 | 节省比 |
|------|--------|
| `rtk cargo build` | -80% |
| `rtk tsc` | 错误按文件分组 |
| `rtk next build` | 精简输出 |
| `rtk ruff check` | -80% |
| `rtk eslint` | 按规则/文件分组 |

### 容器 & 云
| 命令 | 说明 |
|------|------|
| `rtk docker ps` | 紧凑列表 |
| `rtk docker logs <c>` | 去重日志 |
| `rtk kubectl pods` | 紧凑列表 |
| `rtk aws ec2 describe-instances` | 精简实例列表 |

### GitHub CLI
| 命令 | 说明 |
|------|------|
| `rtk gh pr list` | 紧凑 PR 列表 |
| `rtk gh pr view 42` | PR 详情 + 检查状态 |
| `rtk gh issue list` | 紧凑 Issue 列表 |

---

## 七、配置

配置文件路径：
- **Windows**：`%APPDATA%\rtk\config.toml`
- **macOS**：`~/Library/Application Support/rtk/config.toml`
- **Linux**：`~/.config/rtk/config.toml`

```toml
[hooks]
# 跳过这些命令的重写（不经过 RTK 处理）
exclude_commands = ["curl", "playwright"]

[tee]
enabled = true          # 命令失败时保存完整原始输出
mode = "failures"       # "failures" | "always" | "never"
```

---

## 八、常见问题

### Q1：和 WorkBuddy / Claude Code 内置工具冲突吗？

不冲突。RTK 只拦截 Shell/Bash 工具调用。AI IDE 的内置工具（如 Read、Grep、Glob）不经过 Shell hook，**不受影响**。

如果需要享受 RTK 的压缩效果，建议在 AI 工具中直接用 `cat`、`grep`、`find` 等 Shell 命令代替内置工具。

### Q2：会导致信息丢失吗？

RTK 设计了 **tee 机制**：当命令执行失败时，完整原始输出会保存到 `~/.local/share/rtk/tee/`，AI 无需重新执行即可获取完整日志。

### Q3：隐私安全如何？

- 遥测**默认关闭**，需要明确同意
- 不收集源码、文件路径、命令参数、密钥、环境变量等
- 二进制本地运行，不上传命令内容

### Q4：Windows 和 Linux 功能有差异吗？

无差异。v0.37.2 起 Windows 原生二进制 hook 功能与 Linux/macOS 完全一致。

### Q5：怎么卸载？

```bash
rtk init -g --uninstall   # 移除 hook 和配置
cargo uninstall rtk        # 卸载二进制
# 如果用 brew 安装则：brew uninstall rtk
```

---

## 九、实际收益参考

以 Claude Code Max 20x 套餐（$200/月）为例：

| 场景 | 不用 RTK | 用 RTK |
|------|---------|--------|
| 月 Token 消耗 | 100% 额度 | 消耗降 60-90% |
| 等效工作量 | 1x | 3-5x |
| 可选套餐 | $200/月 | $100/月 够用 |

---

## 十、相关链接

- GitHub：https://github.com/rtk-ai/rtk
- Releases：https://github.com/rtk-ai/rtk/releases
- 问题反馈：https://github.com/rtk-ai/rtk/issues
