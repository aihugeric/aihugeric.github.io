---
title: 开源模型最全盘点（2026 年 7 月版）：中美 14 家厂商 30+ 模型全景图
date: 2026-07-13
author: ericxi
category: tech
tags: [ai,LLM]
excerpt: 一张榜单看懂开源大模型格局，盘点中美 14 家厂商 30+ 开源模型。
---

# 开源模型最全盘点（2026 年 7 月版）：中美 14 家厂商 30+ 模型全景图

**来源**：七牛云
**发布时间**：2026/07/14
**原文链接**：https://news.qiniu.com/archives/1783996369018
**分类**：AI与智能服务
**标签**：技术实践 · AI 智能
**字数**：约 67 万 · 阅读耗时约 1678 分钟

> 截至 2026 年 7 月，开源大模型格局已发生历史性变化——Artificial Analysis 开源智能指数前 6 名全部为中国模型（GLM-5.2 以 51 分断层领先），Meta Llama 与 OpenAI gpt-oss 主线均超 11 个月未更新；MoE 稀疏化成为绝对主流，MIT/Apache 2.0 宽松许可成为竞争标配。本文基于 HuggingFace 官方组织页 + Artificial Analysis 榜单当日实测数据，盘点中美 14 家厂商的开源模型全景。

**数据口径说明**：所有参数、许可证、更新日期均来自 HuggingFace 各官方组织页与模型 README（2026-07-13 抓取），智能指数来自 Artificial Analysis Intelligence Index v4.1。下载量为 HF 近期下载数，随时间波动。

---

## 目录

1. [一张榜单看懂格局：开源智能指数 Top 12](#一一张榜单看懂格局开源智能指数-top-12)
2. [国产阵营八强详解](#二国产阵营八强详解)
3. [国际阵营六家详解](#三国际阵营六家详解)
4. [许可证三档速查：商用前必看](#四许可证三档速查商用前必看)
5. [四大趋势判断](#五四大趋势判断)
6. [按场景选模型：八类需求对号入座](#六按场景选模型八类需求对号入座)
7. [FAQ](#七faq)

---

## 一、一张榜单看懂格局：开源智能指数 Top 12

Artificial Analysis Intelligence Index v4.1（由 GDPval-AA v2、Terminal-Bench v2.1、GPQA Diamond 等 9 项评测构成）开源模型排名：

| 排名 | 模型 | 厂商 | 智能指数 | 总参数（激活） | 上下文 | 许可证 |
|---|---|---|---|---|---|---|
| 1 | **GLM-5.2 (max)** | 智谱 | **51** | 753B（40B） | 1M | MIT |
| 2 | MiniMax-M3 | MiniMax | 44 | 428B（23B） | 1M | 自定义社区许可 |
| 2 | DeepSeek V4 Pro（推理） | DeepSeek | 44 | 1.6T（49B） | 1M | MIT |
| 2 | Kimi K2.6 | 月之暗面 | 44 | 1T（32B） | 256k | 修改版 MIT |
| 5 | MiMo-V2.5-Pro | 小米 | 42 | 1.0T（42B） | 1M | — |
| 6 | DeepSeek V4 Flash（推理） | DeepSeek | 40 | 284B（13B） | 1M | MIT |
| 7 | Nemotron 3 Ultra* | NVIDIA | 38 | 550B（55B） | 262k | ⚠️ 权重未开放 |
| 8 | Qwen3.5-397B-A17B（推理） | 阿里 | 34 | 397B（17B） | 262k | Apache 2.0 |
| 9 | Mistral Medium 3.5 | Mistral | 30 | 128B | 256k | — |
| 10 | Gemma 4 31B（推理） | Google | 29 | 30.7B | 256k | Apache 2.0** |
| 11 | gpt-oss-120b (high) | OpenAI | 24 | 117B（5.1B） | 131k | Apache 2.0 |
| 12 | K2 Think V2 | MBZUAI | 17 | 70B | 262k | — |

> Nemotron 3 Ultra 在榜单标注权重 "Not available"，严格意义上不算开放权重模型。
> *Gemma 4 QAT 版已验证 Apache 2.0；基座全系许可建议使用前逐卡核对。

**三个直接结论：**

1. **前 6 名全部是中国模型**，GLM-5.2 以 51 分比第二名高 7 分，断层领先
2. **真正开放权重的美国最强模型是 Gemma 4 31B（29 分）**——与中国第一梯队差距超过 20 分
3. **MoE 稀疏化是绝对主流**：榜单前列模型激活参数占比普遍仅 2~5%（DeepSeek V4 Pro 1.6T 总参数只激活 49B）

---

## 二、国产阵营八强详解

### 2.1 DeepSeek（深度求索）——MIT 许可 + 1M 上下文双旗舰

| 模型 | 参数（总/激活） | 许可证 | 更新 | HF 下载量 |
|---|---|---|---|---|
| DeepSeek-V4-Pro | 1.6T / 49B（MoE） | MIT | 2026-06-22 | 139 万 |
| DeepSeek-V4-Flash | 284B / 13B（MoE） | MIT | 2026-06-22 | **268 万** |
| V4-Pro/Flash-DSpark（投机解码版） | — | MIT | 2026-07-04 | 25 万合计 |

- 双旗舰均支持 **1M 上下文**，目前标注为 **preview 版本**
- V4-Flash 以 13B 激活参数拿下智能指数 40 分，是**性价比密度最高的开源模型之一**
- 7 月新出的 DSpark 投机解码版进一步压推理延迟

> 参数口径说明：官方 README 标称 1.6T/284B；safetensors 文件计数因 FP8 权重口径不同显示为 862B/158B，本文采用官方口径。

### 2.2 智谱 GLM——开源智能指数全球第一

| 模型 | 参数 | 许可证 | 更新 | HF 下载量 |
|---|---|---|---|---|
| GLM-5.2 | 753B（MoE，40B 激活） | MIT | 2026-07-02 | 46 万（FP8 版 276 万+） |
| GLM-5.1 | 754B（MoE） | MIT | 2026-05-13 | 9.4 万 |
| GLM-OCR | 1.3B | MIT | 2026-05-19 | **312 万** |

- GLM-5.2 官方 README 明确宣传 "Pure Open: MIT 许可证，无地区限制"
- 小模型 GLM-OCR 是智谱下载量最高的模型——OCR 是 2026 年开源小模型最卷赛道
- HuggingFace Trending 榜当前第 3 名，社区热度与榜单成绩双高

### 2.3 阿里通义千问 Qwen——生态之王

| 模型 | 参数（总/激活） | 许可证 | 更新 | HF 下载量 |
|---|---|---|---|---|
| Qwen3.6-35B-A3B | 36B / 3B（MoE） | Apache 2.0 | 2026-04-24 | **667 万（全场第一）** |
| Qwen3.5-397B-A17B | 403B / 17B（MoE） | Apache 2.0 | 2026-04-24 | 42 万 |
| Qwen3.5-27B（稠密） | 27.8B | Apache 2.0 | 2026-04-24 | 262 万 |
| Qwen-AgentWorld-35B-A3B | 35B / 3B | — | 2026-06-25 | 9.6 万 |

- Qwen3.6-35B-A3B 是**本次盘点下载量最高的单模型**——3B 激活跑出的性价比让它成为本地部署首选
- 组织页 458 个模型、9.2 万关注，**社区微调生态全球最大**（Trending 榜上大量 Qwen3.6 社区变体）
- 旗舰 Qwen3.5-397B 智能指数 34 分，与第一梯队有差距，但 Apache 2.0 是六强中最干净的商用许可之一

### 2.4 月之暗面 Kimi——万亿参数三连发

| 模型 | 参数（总/激活） | 许可证 | 更新 |
|---|---|---|---|
| Kimi-K2.7-Code | 1T / 32B（MoE，含 400M 视觉编码器） | 修改版 MIT | 2026-06-15 |
| Kimi-K2.6 | 1T / 32B（MoE） | 修改版 MIT | 2026-05-19 |
| Kimi-K2.5 | 1T / 32B（MoE） | 修改版 MIT | 2026-04-30 |

- 三个月三代万亿模型，K2.6 智能指数 44 分并列第二
- K2.7-Code 专攻编码且带视觉编码器（可看 UI 截图写代码）
- **注意**：许可证是"修改版 MIT"（HF 标记 license:other），**不是标准 MIT**，商用前读原文

### 2.5 MiniMax——多模态黑马

| 模型 | 参数（总/激活） | 许可证 | 更新 |
|---|---|---|---|
| MiniMax-M3 | 428B / 23B（MoE，原生多模态，1M 上下文） | MiniMax Community License | 2026-07-11 |
| MiniMax-M2.7 | 229B（MoE） | 自定义 | 2026-04-20 |

- M3 是 **2 天前刚发布**的原生多模态模型（Image-Text-to-Text），智能指数 44 分并列第二
- 开源榜前六中唯一的原生多模态模型——多模态 Agent 场景的开源首选
- 自定义社区许可，商用条款需逐条核对

### 2.6 美团 LongCat——国产最大参数

| 模型 | 参数（总/激活） | 许可证 | 更新 |
|---|---|---|---|
| LongCat-2.0 | 1.6T / ~48B（MoE，1M 上下文） | MIT | 2026-07-08 |
| LongCat-Next（Any-to-Any） | 74B | — | 2026-04-10 |

- 5 天前发布，与 DeepSeek V4 Pro 并列**国产开源总参数之最（1.6T）**
- MIT 许可无保留，但发布太新、下载量尚低（<2000），生态待观察

### 2.7 腾讯混元——Apache 2.0 新旗舰

| 模型 | 参数（总/激活） | 许可证 | 更新 |
|---|---|---|---|
| Hy3 | 295B / 21B + 3.8B MTP（MoE） | Apache 2.0 | 2026-07-06 |
| HunyuanOCR | 1.1B | 自定义 | 2026-07-13（今日更新） |
| Hy-MT2-30B-A3B（翻译） | 30B / 3B | — | 2026-05-26 |

- Hy3 一周前正式发布，**当前 HuggingFace Trending 榜第 1 名**
- 翻译专用模型 Hy-MT2 与 OCR 模型是差异化布局

### 2.8 百度 ERNIE——重心转向 OCR 与文生图

| 模型 | 参数 | 许可证 | 更新 | HF 下载量 |
|---|---|---|---|---|
| Unlimited-OCR | 3.3B | MIT | 2026-07-03 | **151 万** |
| ERNIE-4.5-VL-28B-A3B 系列 | 29B / 3B（MoE） | Apache 2.0 | 2026-03~04 | 21 万 |
| ERNIE-4.5-300B-A47B | 300B / 47B（MoE） | Apache 2.0 | 2025-11 | — |

- 语言大模型主力停留在 4.5 系列（2025 年），**近期开源重心明显转向 OCR 与文生图**
- Unlimited-OCR 下载量爆发，跻身 Trending 榜前 10

---

## 三、国际阵营六家详解

### 3.1 Meta Llama——超过 1 年没有新旗舰

| 模型 | 参数（总/激活） | 许可证 | 更新 |
|---|---|---|---|
| Llama-4-Maverick-17B-128E | 402B / 17B（MoE，128 专家） | Llama 4 社区许可（需申请） | 2025-05 |
| Llama-4-Scout-17B-16E | 109B / 17B（MoE） | 同上 | 2025-05 |
| Llama-3.3-70B-Instruct | 70B 稠密 | Llama 3.3 社区许可 | 2024-12 |

**关键事实**：Meta 自 2025 年 5 月 Llama 4 之后**超过 14 个月未发布新旗舰**，近期仅更新小型安全模型。曾经的开源领头羊已实质性掉队。

### 3.2 Google Gemma——美国阵营最活跃

| 模型 | 参数 | 许可证 | 更新 |
|---|---|---|---|
| Gemma 4 系列（31B/12B/E4B/E2B） | 31B~6B | Apache 2.0（QAT 版已验证） | 2026-07-09（4 天前） |
| gemma-4-26B-A4B（MoE） | 26B / 4B | 同上 | 2026-07-09 |
| DiffusionGemma-26B-A4B（扩散语言模型） | 26B / 4B | 待核对 | 约 2026-07-05 |

- Gemma 4 全系上周刚更新，**许可证从 Gemma 自有许可改为 Apache 2.0 是重大转变**
- DiffusionGemma 是主流厂商首个大规模开源扩散语言模型，下载量已近 200 万
- Gemma 4 31B 智能指数 29 分——**真正开放权重的美国模型最高分**

### 3.3 OpenAI gpt-oss——发布即巅峰

| 模型 | 参数（总/激活） | 许可证 | 更新 | HF 下载量 |
|---|---|---|---|---|
| gpt-oss-120b | 117B / 5.1B（MoE） | Apache 2.0 | 2025-08 | 441 万 |
| gpt-oss-20b | ~21B（MoE） | Apache 2.0 | 2025-08 | **723 万** |

- gpt-oss-20b 下载量 723 万，**历史累计生态巨大**
- 但主线自 2025 年 8 月后**近 11 个月未更新**，近期仅发布 safeguard 安全衍生版
- 智能指数 24 分，已被国产第一梯队拉开一倍差距

### 3.4 Mistral——欧洲独苗，节奏尚可

| 模型 | 参数 | 许可证 | 更新 |
|---|---|---|---|
| Leanstral-1.5-119B-A6B | 119B / 6B（MoE） | 待核对 | 2026-07-02 |
| Ministral-3 系列（3B/8B/14B） | 3B~14B | Apache 2.0 | 2026-06-30 |
| Devstral-2-123B（代码） | 123B 稠密 | Mistral 自有许可 | 2026-06-30 |
| Mistral-Medium-3.5 | 128B | 待核对 | 2026-05-04 |

- 6 月底连发 Ministral-3 + Devstral-2，7 月初再发 Leanstral——**欧洲唯一保持高频开源的厂商**
- Medium 3.5 智能指数 30 分，欧洲最强开源

### 3.5 NVIDIA Nemotron——"开源"要打引号

- Nemotron 3 Ultra（550B/55B）智能指数 38 分，看似美国最强
- **但榜单明确标注权重 "Not available"**——目前只有 API，严格意义上不算开放权重
- Nemotron Labs 系列小模型（30B/75B）确有开放，Trending 榜可见

### 3.6 Microsoft Phi——转向探索期

- Phi 主线最新为 Phi-4-reasoning-vision-15B（2026-03），更新放缓
- 近期活跃在实验性方向：FrogBoss-32B、UserLM-8b、GELab-Zero-4B
- Phi 系列历来 MIT 许可，小模型端侧部署仍有存量价值

---

## 四、许可证三档速查：商用前必看

| 档位 | 许可证 | 模型 | 商用注意 |
|---|---|---|---|
| 🟢 最宽松 | MIT | DeepSeek V4 全系、GLM-5.2/5.1、LongCat-2.0、百度 Unlimited-OCR | 可自由商用、修改、闭源分发 |
| 🟢 宽松 | Apache 2.0 | Qwen 3.5/3.6 全系、腾讯 Hy3、ERNIE 4.5、gpt-oss、Gemma 4（QAT 已验证）、Ministral-3 | 可商用，需保留版权声明与专利授权条款 |
| 🟡 有条件 | 修改版 MIT / 社区许可 / 自有许可 | Kimi K2.x（修改版 MIT）、MiniMax M3（Community License）、Llama 4（需申请授权）、Devstral-2、HunyuanOCR | **必须逐条读原文**——可能含用户量阈值、再分发限制、署名要求 |

**一个重要趋势**：GLM-5.2 把 "Pure Open（MIT、无地区限制）" 写进 README 当卖点、Gemma 4 从自有许可转向 Apache 2.0——**宽松许可已经从法务问题变成竞争武器**。

---

## 五、四大趋势判断

**1. 中美开源攻守易位已成事实**

开源智能指数前 6 名全部是中国模型；Meta（14 个月）和 OpenAI（11 个月）主线停更。美国阵营真正的开源活跃力量只剩 Google Gemma 和 NVIDIA。

**2. MoE 稀疏化 + 1M 上下文成为旗舰标配**

榜单前列模型全部是 MoE，激活参数占比普遍 2~5%；1M 上下文在 GLM-5.2、DeepSeek V4、MiniMax M3、LongCat-2.0、MiMo-V2.5 上全面普及。**"总参数看存储成本，激活参数看推理成本"是新的选型口径。**

**3. 小模型战场转向垂直专用**

下载量最高的不是旗舰而是小模型：Qwen3.6-35B-A3B（667 万）、GLM-OCR（312 万）、gpt-oss-20b（723 万）。OCR、翻译、语音专用小模型成为新卷点——GLM-OCR、Unlimited-OCR、HunyuanOCR 三家 OCR 模型同期爆发。

**4. 发布节奏进入"周更"时代**

仅 2026 年 7 月前两周：MiniMax-M3（7-11）、LongCat-2.0（7-8）、Gemma 4 更新（7-9）、Hy3（7-6）、GLM-5.2（7-2）、Leanstral（7-2）——本文的保鲜期可能只有一个月，这本身就是最大的行业注脚。

---

## 六、按场景选模型：八类需求对号入座

| 场景 | 首选 | 备选 | 理由 |
|---|---|---|---|
| 综合能力天花板 | GLM-5.2 | DeepSeek V4 Pro | 智能指数 51 分断层第一，MIT 许可 |
| Agent / 编码 | Kimi K2.7-Code | DeepSeek V4 Pro | 编码专精 + 视觉编码器 |
| 高并发低成本推理 | DeepSeek V4 Flash | Qwen3.6-35B-A3B | 13B/3B 激活，推理成本极低 |
| 本地部署（消费级显卡） | Qwen3.6-35B-A3B | Gemma 4 12B / gpt-oss-20b | 3B 激活 MoE，量化后单卡可跑 |
| 多模态 Agent | MiniMax-M3 | ERNIE-4.5-VL | 开源前六中唯一原生多模态 |
| OCR / 文档解析 | GLM-OCR | Unlimited-OCR、HunyuanOCR | 三家 2026 年新品，下载量均破 50 万 |
| 长文档 / 超长上下文 | GLM-5.2 / DeepSeek V4（1M） | MiniMax-M3（1M） | 1M 上下文 + 高智能指数 |
| 严格合规商用 | DeepSeek V4 / GLM-5.2（MIT） | Qwen / Hy3（Apache 2.0） | 避开自定义许可的条款风险 |

**部署提示**：以上模型多数已在国内聚合平台上架——如七牛云 AI 大模型广场提供 DeepSeek、GLM、Kimi 等主流开源模型的 OpenAI 兼容 API，选型对比时可以用统一端点逐个实测，不必逐家搭建推理环境。

---

## 七、FAQ

**Q：开源模型和闭源旗舰（Claude/GPT/Gemini）还差多少？**

A：差距在快速收窄但仍存在。开源第一的 GLM-5.2（51 分）与闭源第一梯队仍有差距，但在特定任务（编码、数学、OCR）上，开源模型已可对齐甚至超越部分闭源模型——且成本优势通常是数倍到数十倍。

**Q：参数量口径为什么各家说法不一？**

A：三个常见口径差异：①官方标称 vs safetensors 文件计数（FP8 权重会导致计数差异，如 DeepSeek V4）；②总参数 vs 激活参数（MoE 模型必须区分）；③是否含视觉编码器/MTP 层。本文统一采用官方 README 口径并标注差异。

**Q：Llama 还值得用吗？**

A：存量场景（已有 Llama 微调管线、生态工具链）可以继续用 Llama-3.3-70B/Llama-4；新项目不建议——14 个月未更新意味着能力代差，且社区许可比 MIT/Apache 多一层商用限制。

**Q：NVIDIA Nemotron 3 Ultra 是开源模型吗？**

A：严格说不是。Artificial Analysis 榜单标注其权重 "Not available"，目前只能通过 API 使用。引用"开源榜单"数据时要注意剔除。

**Q：怎么快速实测这些模型再决定用哪个？**

A：三条路径：①HuggingFace 直接下载（需自备算力）；②各厂商官方 API；③聚合平台统一端点（如七牛云 AI 大模型广场，一个 Key 切换多个开源模型对比测试）。建议用自己的真实任务测，不要只看榜单分数。

---

## 小结

2026 年 7 月的开源模型世界：**中国厂商包揽智能指数前六、MIT/Apache 宽松许可成为标配、MoE + 1M 上下文全面普及、小模型战场转向 OCR 等垂直赛道**。对开发者而言，这是开源模型历史上选择最丰富、许可最友好、迭代最快的时刻——唯一的问题是：这份盘点一个月后就需要更新。

**延伸阅读：**

- [七牛云 AI 大模型广场](https://www.qiniu.com/ai/models)——主流开源模型 OpenAI 兼容 API，一个 Key 全部实测
- [Artificial Analysis 开源模型榜](https://artificialanalysis.ai/models/open-source)
- [HuggingFace Trending](https://huggingface.co/models?sort=trending)

---

*数据来源：HuggingFace 各官方组织页 + API（2026-07-13 抓取）、Artificial Analysis Intelligence Index v4.1。模型迭代极快，引用前请核对最新版本。*
