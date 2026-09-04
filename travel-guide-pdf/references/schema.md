# 目录约定与数据结构

## 工作目录（WORK）
- WORK/tmp/guide2/research/   调研事实表（md + facts.json）
- WORK/tmp/guide2/photos/     下载原图 + manifest.json（来源、作者、许可、尺寸）
- WORK/tmp/guide2/processed/  统一裁切/压缩后的单图与拼图（封面、4:3 单图、col_*.jpg 拼图）
- WORK/tmp/guide2/map/        高德瓦片拼合的地图 map_overview.png
- WORK/tmp/guide2/html/       生成的 guide.html
- WORK/output/pdf/            最终 PDF

## images.json（fetch_wikimedia.py 读取）
一个对象：键 = 用途名（如 yuyuan、sj_b），值 = 单个检索词或检索词数组。程序会选横向、高清、且标题未用过的图片下载，写入 photos/ 并更新 manifest.json。

示例见 assets/examples/images.example.json。

## collages.json（make_collages.py 读取）
对象：
- singles：数组，列出需要裁成 4:3 单图的原图键（供页面直接使用）
- collages：对象，键 = 输出拼图文件名（col_xxx.jpg），值 = 两张原图键的数组
程序读 photos/ 原图，中心裁切后做圆角双拼到 processed/。

示例见 assets/examples/collages.example.json。

## map_stops.json（build_map.py 读取）
数组，每项：
- short：右侧竖线/图例里的短名
- label：长名（图例/悬停）
- lon、lat：WGS84 经纬度（脚本内部转 GCJ-02 对齐高德瓦片）
- day：1 或 2
- order：当天顺序
- start：可选，标记起点酒店（如 true）
示例见 assets/examples/map_stops.example.json。

## make_guide_html.cjs 的内容数据区（按问答替换）
文件内含上海完整示例；替换点集中在各函数：
- coverHTML：副标题/说明/封面 chips
- daySummary：两日路线与一句话记忆点
- hotelHTML：酒店数组（名称、地址、地铁、价格、卖点、同档备选）
- Day1/Day2 的 itinPage 调用：panels 数组 = 每一站卡片（num、short、title、time、chips、lead、facts 二维表、note、trans 交通标注、img/imgCap）；leg = 页脚补充横幅
- foodHTML：rows 美食表（餐次/主选/招牌/备选/人均/排队）与点菜小抄
- tipsA/BHTML：贴士卡片、预算表、预约清单、预案、Q&A、资料来源
- mapHTML：地图说明与速记
图片一律引用 IMG 常量（由 processed/ 生成 data URI）；保证每张只引用一次。
