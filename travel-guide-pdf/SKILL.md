---
name: travel-guide-pdf
description: 把旅行需求先通过提问确认，再自动制作图文并茂的中文 PDF 攻略：联网调研、收集高清图与菜品拼图、生成高德风格行程地图、按杂志式版式排版、打印并校验交付。适用于要成品攻略或图文 PDF 或旅行手册的请求；单纯口头聊行程规划不使用本技能。
---

# 图文旅行攻略 PDF

## 目的与触发

用户想要一份可直接阅读、打印、分享的图文攻略 PDF（中文、A4、几十页以内）。本技能把做攻略的完整流水线沉淀为固定步骤，保证结果稳定、精美、可复核。先提问，再自动完成。

## 开跑前必问（一次问清，缺失用推荐默认并告知）

1. 目的地与天数（如：上海 2 日 / 东京 3 日）
2. 出行日期或窗口（影响当季活动、门票、假期与客流提示；有具体日期最优先）
3. 人数与构成（情侣 / 朋友 / 亲子 / 带长辈）
4. 预算档位与酒店档位（推荐默认：舒适中档，人均每天 ¥500–800；酒店按亚朵或同级）
5. 主题偏好（经典全景 / 文艺小众 / 亲子乐园 / 美食专项）
6. 输出细节：语言（默认中文）、页面风格（默认：地点大标题卡片 + 左右交替配图 + 每页右侧路线竖线、圆圈、交通标注）、是否要行程地图总览（默认要）、封面偏好
7. 交付方式：保存路径；是否复制到桌面（默认询问后执行）
8. 联网与图片授权：是否允许联网调研（默认允许）；图片来源与是否可用拼图、实拍、AI 兜底

提问模板与推荐默认见 references/questions.md。用户不答的项使用该默认，并在交付时列出假设。

## 工作流程（在独立工作目录 WORK 内执行）

先创建独立工作目录（如 项目/travel_guide_work/），把本技能 assets/ 与 scripts/ 复制进去，之后一切在 WORK 内进行，避免污染用户项目。

0. 脚手架：目录约定见 references/schema.md（WORK/tmp/guide2/ 下分 research、photos、processed、map、html；成品在 WORK/output/pdf/）。
1. 调研到事实表：按 references/research.md 联网查携程/Trip.com、小红书（含聚合源）、目的地文旅与官网、点评与票务、地图、天气与假期；每个核心主题至少 1 条来源，记录来源 URL 与核实日期到 tmp/guide2/research/。
2. 图片与拼图：先写 images.json，运行 python scripts/fetch_wikimedia.py（Wikimedia，排除已用标题、限速重试）；再写 collages.json（含可选 singles），运行 python scripts/make_collages.py，生成多图拼一框的艺术拼图与 4:3 单图到 processed/。铁律：同一张图全册只出现一次；同一道菜或同一景点的多图展示用拼图实现；找不到合适实拍才用 AI 并标注。
3. 行程地图总览：写 map_stops.json（WGS84 经纬度、day、order、short 名称），运行 python scripts/build_map.py，生成高德瓦片底图 + 双色星标、顺序、箭头 + 图例（默认 Day1 红 / Day2 蓝）。
4. 内容与文案：编辑 assets/make_guide_html.cjs 顶部数据与函数（内含上海示例并标注需按问答替换的数据区：封面、日总结、酒店、站点面板、美食表、贴士、预算、地图说明）。把事实表写进对应字段。
5. 排版打印：node assets/make_guide_html.cjs 生成 WORK/tmp/guide2/html/guide.html，再 node assets/print_guide.cjs 打印 PDF（内置逐页溢出与页脚冲突检查、体积报告）。
6. 校验与交付：对照质量门；把 PDF 放到用户指定位置（默认 项目/output/pdf/，并询问是否复制桌面）。请用户翻看并按反馈迭代。

## 质量门（满足后再交付）

- A4 固定尺寸；每页不越界、不与页脚重叠（print_guide.cjs 逐页 metrics 的 overflow 全为 0）。
- 中文无乱码；每页无明显大面积空白（行程页应填满，用 metrics 判断）。
- 全册图片零重复（用完整 data URI 计数等于 1 验证）；拼图只在对应板块出现一次。
- 事实表与正文一致：时间、票价、开放与预约、餐厅、酒店均可回溯来源与核实日期；PDF 注明以官网当日为准。
- 设计系统统一（默认深蓝加金、Art-Deco 编辑杂志风、大标题卡片、左右交替配图、右侧路线竖线），不混搭另一套风格。

## 关键经验（避免返工）

- 携程与小红书直连通常被反爬或需登录：用搜索引擎索引正文 + 官方与聚合源，并在事实表如实标注未直连、经何种途径。
- HTML 转 PDF 用 bundled Chromium（Playwright）以 file:// 打印；不要用 SVG feTurbulence 噪点做整页背景（会让 PDF 膨胀到 17MB 以上），用 CSS 渐变即可。
- 排版以页面填满 + 卡片弹性拉伸为准：行程页用 flex 让卡片自动平分剩余高度；纯文字页靠补充实用内容块填满。
- 图片统一裁切压缩到 processed/；拼图用 PIL 圆角双拼（如两个小笼、两个红烧肉、园林加城隍庙）。

## 资源索引

- references/questions.md  提问清单与推荐默认
- references/research.md   调研来源矩阵与事实表要求
- references/schema.md     目录约定与 images.json、collages.json、map_stops.json、内容数据区说明
- scripts/fetch_wikimedia.py、scripts/make_collages.py、scripts/build_map.py
- assets/make_guide_html.cjs（含上海示例与可编辑数据区）、assets/print_guide.cjs
- assets/examples/  配置示例
