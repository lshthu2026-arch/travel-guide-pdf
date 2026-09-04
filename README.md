# 旅行攻略 PDF 生成器（Agent Skill）

> 把一句旅行需求自动变成图文并茂、可打印的中文 PDF 攻略。

![GitHub stars](https://img.shields.io/github/stars/lshthu2026-arch/travel-guide-pdf)

## 这是什么
给 AI 助手（Codex）用的 **Skill**。说一句旅行需求，它自动完成：
1. 提问确认（目的地、天数、人数、预算、风格）
2. 联网调研景点 / 餐厅 / 门票，并记下来源
3. 收集图片、自动拼图、生成行程地图
4. 杂志式排版输出 A4 中文 PDF，逐页校验

## 效果展示
<img width="973" height="1304" alt="屏幕截图 2026-09-04 173058" src="https://github.com/user-attachments/assets/d2af5cab-5561-4c52-830d-adff6e67b1b1" />
<img width="968" height="1305" alt="屏幕截图 2026-09-04 173212" src="https://github.com/user-attachments/assets/18494fc9-4ad9-4ae5-8049-65c22393388c" />
<img width="958" height="1329" alt="屏幕截图 2026-09-04 173224" src="https://github.com/user-attachments/assets/cce64bf1-673c-4d23-a579-23e8acd203ec" />


## 两种获取方式

### 🧑 方式一：人类下载
点仓库右上角绿色 `Code` → `Download ZIP`；或用 git：

```bash
git clone https://github.com/lshthu2026-arch/travel-guide-pdf.git
```

### 🤖 方式二：让 AI 帮你安装
在 Codex 里直接说：

```text
$skill-installer install https://github.com/lshthu2026-arch/travel-guide-pdf/tree/main/travel-guide-pdf
```

装完重启 Codex，然后说"帮我做一份上海两日游攻略"就能用。

## 使用示例
（放一个真实输入 → 输出）

## 支持的能力
- 中文 / A4 图文 PDF
- 自动配图 + 菜品拼图
- 行程地图总览（Day1 / Day2）
- 预算 / 酒店 / 餐厅 / 贴士
- 逐页校验：防溢出、防图片重复

## License
MIT
## 数据与许可

- **代码**：基于 MIT 许可，可自由使用、修改、再分发。
- **地图底图**：来自高德地图（AutoNavi）。商用或大规模使用前，请遵守高德开放平台的使用条款，并自行申请对应的 key / 授权。本技能不代授高德数据。
- **图片**：来自 Wikimedia Commons，作者与许可信息已在生成时写入 manifest；CC-BY 图片请在成品中保留署名。
- **攻略信息**：仅作参考，出行前请以官方/平台最新信息为准。
