# 旅行攻略 PDF 生成器（Agent Skill）

> 把一句旅行需求自动变成图文并茂、可打印的中文 PDF 攻略。

![GitHub stars](https://img.shields.io/github/stars/lshu2026-arch/travel-guide-pdf)

## 这是什么
给 AI 助手（Codex）用的 **Skill**。说一句旅行需求，它自动完成：
1. 提问确认（目的地、天数、人数、预算、风格）
2. 联网调研景点 / 餐厅 / 门票，并记下来源
3. 收集图片、自动拼图、生成行程地图
4. 杂志式排版输出 A4 中文 PDF，逐页校验

## 效果展示
（放 1-2 张成品 PDF 截图，这是最吸引加星的地方，一定放！）

## 两种获取方式

### 🧑 方式一：人类下载
点仓库右上角绿色 `Code` → `Download ZIP`；或用 git：

```bash
git clone https://github.com/lshu2026-arch/travel-guide-pdf.git
```

### 🤖 方式二：让 AI 帮你安装
在 Codex 里直接说：

```text
$skill-installer install https://github.com/lshu2026-arch/travel-guide-pdf/tree/main/travel-guide-pdf
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
