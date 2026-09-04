// ============================================================================
// 旅行攻略 HTML 生成器（含上海完整示例）
// 用法：在 WORK 目录放置 images/collages/map 产物后，编辑下方各函数中的数据区
//   （封面、daySummary、hotelHTML、Day1/Day2 的 itinPage panels/leg、foodHTML、
//    tipsA/BHTML、mapHTML），然后：GUIDE_DIR=<WORK> node make_guide_html.cjs
// 图片自动从 WORK/tmp/guide2/processed/ 读取生成 data URI；保证每张只引用一次。
// 数据区替换指南见技能 references/schema.md。
// ============================================================================
// -*- mode: js -*- generate designed HTML guide -> PDF via chromium
const fs = require('fs');
const path = require('path');
const BASE = process.env.GUIDE_DIR ? require('path').resolve(process.env.GUIDE_DIR) : process.cwd();
const PROC = path.join(BASE, 'tmp/guide2/processed');
const MAPPNG = path.join(BASE, 'tmp/guide2/map/map_overview.png');
const OUTDIR = path.join(BASE, 'tmp/guide2/html');
fs.mkdirSync(OUTDIR, { recursive: true });
function img(name){ return 'data:image/jpeg;base64,' + fs.readFileSync(path.join(PROC,name)).toString('base64'); }
const IMG = {
  cover: img('cover_hd.jpg'), yuyuan: img('yuyuan.jpg'), chenghuang: img('chenghuang.jpg'),
  nanjing: img('nanjing.jpg'), bund: img('bund_day.jpg'), cruise: img('cruise.jpg'),
  lujiazui: img('lujiazui.jpg'), tower: img('tower.jpg'), wukang: img('wukang.jpg'),
  xintiandi: img('xintiandi.jpg'), xlb: img('xiaolongbao.jpg'), sj: img('shengjian.jpg'),
  hsr: img('hongshaorou.jpg'), bund2: img('bund2.jpg'), sj_b: img('sj_b.jpg'),
  xlb_b: img('xlb_b.jpg'), hsr_c: img('hsr_c.jpg'),
  col_yuyuan: img('col_yuyuan.jpg'), col_xlb: img('col_xlb.jpg'), col_hsr: img('col_hsr.jpg')
};
const MAPDATA = 'data:image/png;base64,' + fs.readFileSync(MAPPNG).toString('base64');
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function krow(k, v){ return '<div class="krow"><span class="k">'+k+'</span><span class="v">'+v+'</span></div>'; }
function panelHtml(p, idx){
  const side = p.side || (idx % 2 ? 'r' : 'l');
  const chips = (p.chips||[]).map(c=>'<span class="chip '+esc(c[1])+'">'+esc(c[0])+'</span>').join('');
  let facts = (p.facts||[]).map(f=>krow('<b>'+esc(f[0])+'</b>', f[1])).join('');
  let media = p.img ? '<div class="pmedia"><img src="'+p.img+'" alt=""><span class="plabel">'+esc(p.imgCap||'')+'</span></div>' : '';
  return '<article class="panel" data-short="'+esc(p.short)+'" data-num="'+(p.num||idx+1)+'">'
    + '<div class="phead"><span class="pno">'+(p.num||idx+1)+'</span>'
    + '<div class="ptitle">'+esc(p.title)+'</div>'
    + '<div class="pchips">'+chips+'</div>'
    + (p.time?'<div class="ptime">'+esc(p.time)+'</div>':'')
    + '</div>'
    + '<div class="pbody side-'+side+'">'
    +   media
    +   '<div class="ptext">'+(p.lead?'<div class="lead">'+p.lead+'</div>':'')+facts+(p.note?'<div class="note">'+p.note+'</div>':'')+'</div>'
    + '</div></article>';
}
const PAGES = [];
let ITIN = 0;
function itinPage(o){
  ITIN++;
  const phtml = o.panels.map((p,i)=>panelHtml(p,i)).join('');
  const nodes = o.panels.map((p,i)=>({ short:p.short, color:o.color, trans: p.trans || null, num:p.num||(i+1) }));
  return '<section class="page itin">'
    + '<header class="topbar"><span class="tb-l">上海两日游 · 9 月图文攻略</span><span class="tb-r">MAGICAL SHANGHAI · 2026-09</span></header>'
    + '<div class="content">'
    +   '<div class="secbar" style="--ac:'+o.color+'"><span class="secno">'+esc(o.sec)+'</span><div class="secti"><h1>'+esc(o.title)+'</h1><div class="sechint">'+esc(o.sub)+'</div></div></div>'
    +   '<div class="itinwrap" data-nodes=\''+JSON.stringify(nodes)+'\'>'
    +     '<div class="panels">'+phtml+'</div><div class="rail"></div>'
    +   '</div>'
    +   (o.leg?'<div class="legnote"><b>'+esc(o.leg[0])+'</b>'+o.leg[1]+'</div>':'')
    + '</div>'
    + '<footer class="fbar"><span class="fpage">PAGE_NO</span><span class="fnote">信息核实 2026-09-03</span></footer>'
    + '</section>';
}
function plainPage(inner){
  return '<section class="page">'
    + '<header class="topbar"><span class="tb-l">上海两日游 · 9 月图文攻略</span><span class="tb-r">MAGICAL SHANGHAI · 2026-09</span></header>'
    + '<div class="content">'+inner+'</div>'
    + '<footer class="fbar"><span class="fpage">PAGE_NO</span><span class="fnote">信息核实 2026-09-03</span></footer>'
    + '</section>';
}
function coverPage(inner){
  return '<section class="page cover">'+inner+'<div class="coverfoot"><span class="cf1">SHANGHAI · TWO DAYS</span><span class="cf2">2026.09 · 图文攻略</span></div></section>';
}
const CSS = `
:root{
  --navy:#1a2a4a; --navy2:#223a66; --gold:#c9a227; --red:#d64541; --blue:#1f6feb;
  --ink:#2b2b2b; --mut:#666; --line:#ddd3bd; --cream:#faf6ed; --cream2:#f4ecdb;
}
*{box-sizing:border-box; margin:0; padding:0;}
html,body{background:#efe9dc;}
body{font-family:'Microsoft YaHei','PingFang SC',sans-serif; color:var(--ink);}
.page{width:210mm; height:297mm; position:relative; overflow:hidden; background:var(--cream);
  page-break-after:always; break-after:page; -webkit-print-color-adjust:exact; print-color-adjust:exact;}
.page:last-child{page-break-after:auto; break-after:auto;}

.topbar{position:absolute; top:0; left:0; right:0; height:9.5mm; background:linear-gradient(90deg,#16233f,#1a2a4a 55%,#2a4070);
  display:flex; align-items:center; justify-content:space-between; padding:0 10mm; color:#fff; z-index:5;}
.topbar .tb-l{font-family:'SimHei'; font-size:9.5pt; letter-spacing:.5px;}
.topbar .tb-r{font-size:6.8pt; color:#cdd6e8; letter-spacing:.4px;}
.fbar{position:absolute; bottom:0; left:0; right:0; height:9mm; display:flex; align-items:center; justify-content:center;
  border-top:1.2px solid var(--gold); color:#8a8a8a; font-size:7.5pt; background:var(--cream); z-index:5;}
.fbar .fnote{position:absolute; right:10mm; color:#b0a892; font-size:6.5pt;}
.content{position:absolute; top:13mm; left:10mm; right:10mm; bottom:13mm;}

.secbar{display:flex; align-items:center; gap:5mm; margin-bottom:4mm;
  background:linear-gradient(90deg,var(--navy),#28406f); border-left:4mm solid var(--ac,#c9a227);
  border-radius:2.5mm; padding:3.2mm 5mm; box-shadow:0 1mm 2mm rgba(26,42,74,.18);}
.secbar .secno{font-family:'SimHei'; font-size:13pt; color:var(--ac,#c9a227); font-weight:700;}
.secbar h1{font-family:'SimHei'; font-size:15.5pt; color:#fff; letter-spacing:1px;}
.secbar .sechint{font-size:7.6pt; color:#cdd6e8; margin-top:1mm; letter-spacing:.3px;}
.secti{flex:1}

.h2{font-family:'SimHei'; font-size:12pt; color:var(--navy); margin:3.5mm 0 2mm; display:flex; align-items:center; gap:2.5mm;}
.h2::before{content:''; width:1.6mm; height:5mm; background:var(--gold); border-radius:1mm; display:inline-block;}
.sub{color:var(--mut); font-size:8pt; margin-bottom:2mm;}
.tbl{width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--line);}
.tbl th{background:var(--navy); color:#fff; font-family:'SimHei'; font-size:8.2pt; padding:2mm 2.5mm; text-align:left;}
.tbl td{font-size:8pt; padding:2mm 2.5mm; border-top:1px solid #eee6d6; vertical-align:top; line-height:1.5;}
.tbl tr:nth-child(even) td{background:#fbf7ee;}
.tint{background:linear-gradient(90deg,#f6efe0,#fbf7ee); border-left:1.6mm solid var(--gold); border-radius:1.5mm; padding:2.5mm 3.5mm; margin:2.5mm 0; font-size:8.2pt; line-height:1.62;}
.tint b.ti{color:var(--navy);}
.imgstrip{display:flex; gap:3mm; margin:2mm 0;}
.imgstrip figure{flex:1; background:#fff; border:1px solid var(--line); border-radius:2mm; padding:1.5mm; text-align:center;}
.imgstrip img{width:100%; height:auto; border-radius:1mm; display:block;}
.imgstrip figcaption{font-size:7pt; color:#777; padding-top:1.2mm;}

.cover{background:radial-gradient(120% 90% at 85% -10%, #2a4070 0%, #1a2a4a 42%, #16233f 100%);}
.cover .cv-inner{position:absolute; inset:0; padding:18mm 18mm 22mm; color:#fff; display:flex; flex-direction:column;}
.cover .cv-frame{position:absolute; inset:5mm; border:1px solid rgba(201,162,39,.55); border-radius:3mm; pointer-events:none;}
.cover .cv-frame::before{content:''; position:absolute; inset:2mm; border:1px solid rgba(255,255,255,.16); border-radius:2mm;}
.cover .cv-top{display:flex; justify-content:space-between; font-size:7pt; letter-spacing:2px; color:#d8c48a; margin-bottom:2mm;}
.cover h1{font-family:'SimHei'; font-size:42pt; letter-spacing:6px; text-align:center; margin-top:2mm;}
.cover .cv-sub{text-align:center; font-size:13pt; color:#e7b95c; letter-spacing:3px; margin-top:3mm;}
.cover .cv-cover{flex:1; margin:6mm 0 4mm; border-radius:3mm; overflow:hidden; border:2px solid rgba(255,255,255,.35); box-shadow:0 4mm 10mm rgba(0,0,0,.4);}
.cover .cv-cover img{width:100%; height:100%; object-fit:cover; display:block;}
.cover .cv-intro{font-size:8.8pt; line-height:1.8; text-align:center; color:#e7ecf6;}
.cover .cv-chips{display:flex; gap:4mm; margin-top:5mm;}
.cover .cchip{flex:1; border:1px solid rgba(201,162,39,.5); background:rgba(255,255,255,.06); border-radius:2.5mm; padding:3mm 2.5mm; text-align:center;}
.cover .cchip b{display:block; color:#e7b95c; font-size:9.5pt; margin-bottom:1mm;}
.cover .cchip span{font-size:7.2pt; color:#d7ddee; line-height:1.5; display:block;}
.coverfoot{position:absolute; left:0; right:0; bottom:4mm; text-align:center; color:rgba(255,255,255,.5); font-size:7pt; letter-spacing:3px;}

.itinwrap{position:relative;}
.panels{padding-right:14.5mm;}
.rail{position:absolute; top:2mm; bottom:2mm; right:0; width:13mm;}
.rail-line{position:absolute; left:6.2mm; top:0; bottom:0; width:0.5mm; background:rgba(90,90,90,.25); border-radius:1mm;}
.rnode{position:absolute; left:0; width:13mm; transform:translateY(-50%); text-align:center;}
.rnode .rdot{width:4.4mm; height:4.4mm; border-radius:50%; margin:0 auto; background:var(--dot,#c9a227);
  border:1mm solid #fff; box-shadow:0 0 0 0.32mm var(--dot,#c9a227),0 0.8mm 1.6mm rgba(0,0,0,.15);}
.rnode .rname{display:block; margin-top:0.8mm; font-size:6.6pt; color:#333; line-height:1.2; max-width:13mm;}
.rchip{position:absolute; left:0; width:13mm; text-align:center; transform:translateY(-50%);}
.rchip .rct{display:inline-block; background:#fff; border:0.35mm solid #cfc5aa; color:#5a5a5a; border-radius:1.6mm;
  font-size:6pt; padding:0.3mm 1mm; line-height:1.25; box-shadow:0 0.4mm 0.9mm rgba(0,0,0,.08);}
.rchip .rct b{color:var(--navy);}

.panel{background:#fff; border:0.5mm solid var(--line); border-radius:3mm; margin-bottom:4mm; overflow:hidden;
  box-shadow:0 1mm 2.5mm rgba(26,42,74,.08);}
.panel .phead{display:flex; align-items:center; gap:3mm; padding:2.4mm 4mm;
  background:linear-gradient(90deg, rgba(214,69,65,.10), #fff 55%); border-bottom:0.4mm solid #eee2c8;}
.panel .pno{font-family:'SimHei'; color:#fff; background:var(--day,#d64541); min-width:6.6mm; height:6.6mm; border-radius:50%;
  display:flex; align-items:center; justify-content:center; font-size:10pt; flex:none;}
.panel .ptitle{font-family:'SimHei'; font-size:15.5pt; color:var(--navy); letter-spacing:.5px;}
.panel .pchips{display:flex; gap:1.5mm; margin-left:auto; flex-wrap:wrap; justify-content:flex-end;}
.panel .chip{font-size:6.6pt; padding:0.6mm 2mm; border-radius:5mm; white-space:nowrap;}
.chip.red{background:#fbe4e2; color:#b03a2e;}
.chip.blue{background:#e4edfc; color:#1f56a0;}
.chip.gold{background:#f5e9c8; color:#8a6d1f;}
.chip.gray{background:#efede8; color:#666;}
.panel .ptime{font-size:6.8pt; color:#8a6d1f; font-family:'SimHei'; white-space:nowrap;}
.panel .pbody{display:flex; align-items:stretch;}
.panel .pmedia{width:43%; position:relative; min-height:12mm;}
.panel .pmedia img{width:100%; height:100%; object-fit:cover; display:block;}
.panel .plabel{position:absolute; left:0; right:0; bottom:0; padding:0.8mm 2mm; font-size:6.6pt; color:#fff;
  background:linear-gradient(0deg,rgba(0,0,0,.55),transparent); text-align:center;}
.panel .ptext{flex:1; padding:2.8mm 3.6mm;}
.panel .lead{font-size:8.4pt; line-height:1.7; color:#333; margin-bottom:1.6mm;}
.panel .krow{display:flex; gap:2mm; font-size:7.7pt; line-height:1.58; padding:0.6mm 0; border-bottom:0.2mm dashed #eee2c8;}
.panel .krow:last-child{border-bottom:none;}
.panel .k{color:var(--mut); min-width:10mm; flex:none; font-weight:600;}
.panel .v{color:#333;}
.panel .note{font-size:7.5pt; color:#5a5a5a; background:#fbf6ea; border-radius:1.5mm; padding:1.6mm 2.4mm; margin-top:1.6mm; line-height:1.6;}
.legnote{background:#fff; border:0.4mm solid var(--line); border-left:1.8mm solid var(--gold,#c9a227); border-radius:2mm;
  padding:2.4mm 3.5mm; font-size:7.9pt; line-height:1.65; margin-top:1mm; color:#444;}

.subhead{font-family:'SimHei'; font-size:11.5pt; color:var(--navy); margin:3mm 0 1.6mm; display:flex; align-items:center; gap:2mm;}
.subhead::before{content:''; width:1.4mm; height:4.6mm; background:var(--gold); display:inline-block; border-radius:1mm;}
.mt{margin-top:3mm;} .mb{margin-bottom:2mm;}
.small{font-size:7.4pt; color:#777; line-height:1.7;}
.factline{font-size:8.2pt; line-height:1.7; margin-bottom:1.4mm;}
`;

// ============================ COVER ============================
function coverHTML(){
  const chips = [
    ["出行窗口", "9 月平日 · 避开中秋 9/25–27 与国庆 10/1–7"],
    ["人物与预算", "两人 · 人均约 ¥700–850 / 天（舒适中档）"],
    ["住宿层级", "亚朵及其同级 · 人民广场—南京东路"],
    ["末尾彩蛋", "第 7 页：高德地图总览 · 红=Day1 蓝=Day2"],
  ].map(function(c){ return '<div class="cchip"><b>'+c[0]+'</b><span>'+c[1]+'</span></div>'; }).join('');
  return '<section class="page cover"><div class="cv-frame"></div><div class="cv-inner">'
    + '<div class="cv-top"><span>SHANGHAI · TWO-DAY GUIDE</span><span>SEP 2026 · EDITION 02</span></div>'
    + '<h1>上海两日游</h1><div class="cv-rule"></div>'
    + '<div class="cv-cover"><img src="' + IMG.cover + '"/></div>'
    + '<div class="cv-intro">老城与十里洋场 × 摩天与梧桐 · 精确到时段的行程规划<br/>在哪里吃 · 门票多少 · 人多不多 · 坐地铁还是打车 · 都有答案</div>'
    + '<div class="cv-chips">' + chips + '</div>'
    + '</div><div class="coverfoot">票价 · 营业 · 排队信息核实于 2026-09-03｜出行前请以官网/App 当日为准</div></section>';
}

// ============================ OVERVIEW ============================
function daySummary(d){
  return '<div class="dsum" style="border-left:3mm solid ' + d.color + '">'
    + '<div class="ds-head"><span class="ds-tag" style="background:' + d.color + '">' + d.tag + '</span><span class="ds-title">' + d.title + '</span></div>'
    + '<div class="ds-route">' + d.route + '</div>'
    + '<div class="ds-note">' + d.note + '</div></div>';
}
function overviewHTML(){
  let h = '';
  h += '<div class="secbar" style="--ac:#c9a227"><span class="secno">01</span><div class="secti"><h1>行程总览</h1><div class="sechint">两日路线一图看懂 + 9 月出行速览 · Day1 红线 / Day2 蓝线</div></div></div>';
  h += daySummary({ color:'#d64541', tag:'DAY 1', title:'老城与十里洋场（浦西）',
    route:'大壶春早餐 → 豫园·城隍庙 → 南京东路步行街 → 外滩日落 → 老正兴本帮晚餐 → 黄浦江夜游船 → 夜景步行回酒店',
    note:'步行 + 地铁 10 号线为主，集中在黄浦区；傍晚外滩看日落、夜游船看灯光是重头戏。' });
  h += '<div style="height:2.6mm"></div>';
  h += daySummary({ color:'#1f6feb', tag:'DAY 2', title:'摩天与梧桐（浦东 → 浦西）',
    route:'上海中心·上海之巅 → 陆家嘴滨江 → 上海小南国午餐 → 武康路梧桐漫步 → 新天地/思南公馆 → 圆苑晚餐 → 石库门夜景',
    note:'过江与去武康路用地铁，武康路→新天地打车更顺；一早登高最省排队时间。' });
  h += '<div class="tipgrid" style="margin-top:1mm">';
  h += '<div class="tipcard" style="border-left-color:#d64541"><b>Day1 记忆点</b>清晨豫园（开门即进）→ 午后南京东路 → 外滩日落 → 黄浦江夜游船收尾。</div>';
  h += '<div class="tipcard" style="border-left-color:#1f6feb"><b>Day2 记忆点</b>上海之巅看全城 → 陆家嘴滨江 → 武康梧桐午后 → 新天地夜色收尾。</div>';
  h += '</div>';
  h += '<div class="tint"><b class="ti">数据速览</b>：两日步行约 8–10km · 地铁 5 段 · 打车 3 段（福州路→十六铺、武康→新天地、新天地→酒店）。每站怎么去见 03–04 页卡片。</div>';
  h += '<div class="h2">9 月出行速览</div>';
  h += '<table class="tbl"><tr><th>项目</th><th>要点</th></tr>'
    + row2('天气','22–31℃，白天仍可能超 30℃，常午后阵雨/台风：短袖+薄外套+折叠伞')
    + row2('人流','全年无真正淡季：豫园 9:00 开门即进、外滩 17:30 前占位、武康大楼 9 点前/16 点后更出片')
    + row2('假期','中秋 9/25–27、国庆 10/1–7 全城爆满：首选 9 月上中旬平日')
    + row2('交通','地铁为主（10 号线豫园 / 2 号线陆家嘴 / 10·11 号线交通大学）；支付宝/微信乘车码')
    + row2('预约','豫园（小程序“上海豫园”）、上海中心分时票需提前实名；老正兴提前 1 天电话订座')
    + '</table>';
  h += '<div class="tint"><b class="ti">路线设计逻辑</b>：① 同区短程步行/骑行（城隍庙↔南京东路↔外滩↔十六铺，2km 内不打车）；② 过江与跨区坐地铁（南京东路—陆家嘴 2 号线 1 站、去武康路 10 号线直达）；③ 只有武康路→新天地约 5km 且换乘绕路，改打车；④ 登高与拍照都赶早。</div>';
h += '<div class="tint" style="background:linear-gradient(90deg,#eef3fb,#fbf7ee)"><b class="ti">本攻略怎么用</b>：03–04 页是两天分时行程——每站一块“大标题卡片”（配图左右交替）+ 页面右侧一条“路线竖线”，圆圈＝站点、点间标注＝交通方式；05 美食、06 贴士预算、07 地图总览。</div>';
  return h;
}
function row2(a,b){ return '<tr><td style="width:14mm"><b>'+a+'</b></td><td>'+b+'</td></tr>'; }

// ============================ HOTEL ============================
function hotelCard(h){
  return '<div class="hotel">'
    + '<div class="htop"><span class="hname">' + h.name + '</span>' + (h.tag?'<span class="htag">'+h.tag+'</span>':'') + '<span class="hprice">' + h.price + '</span></div>'
    + '<div class="hmeta">' + h.addr + ' ｜ ' + h.metro + '</div>'
    + '<div class="hwhy">' + h.why + '</div></div>';
}
function hotelHTML(){
  let h = '';
  h += '<div class="secbar" style="--ac:#c9a227"><span class="secno">02</span><div class="secti"><h1>住宿推荐（亚朵层级）</h1><div class="sechint">首选 人民广场—南京东路 · 9 月平日参考价</div></div></div>';
  h += '<div class="sub">两条动线都从市中心出发：去豫园、外滩、陆家嘴都近，往返机场/高铁方便；携程/去哪儿/亚朵小程序比价，早订更便宜。</div>';
  h += hotelCard({ name:'人民广场南京路步行街亚朵酒店', tag:'首推', price:'约 ¥700–950 / 晚',
    addr:'黄浦区 宁波路 586 号', metro:'距南京路步行街约 100m · 地铁 1/2/8 号线人民广场站约 350m',
    why:'两条动线的中心点：Day1 步行去南京东路/外滩，Day2 过江上地铁也最近；亚朵标准 4 星服务、含早餐与深夜粥道。' });
  h += hotelCard({ name:'外滩南京东路亚朵酒店', tag:'位置最优', price:'约 ¥850–1200 / 晚',
    addr:'黄浦区 福州路 105-1 号', metro:'步行约 3 分钟到外滩 · 近南京东路地铁站',
    why:'Day1 老正兴晚餐与十六铺夜游后都能步行回店；携程点评 9.4 分 / 上万条，预算够就选它。' });
  h += hotelCard({ name:'人民广场大世界地铁站亚朵酒店', tag:'更省', price:'约 ¥650–900 / 晚',
    addr:'黄浦区 金陵东路 500 号 亚龙广场 7F', metro:'地铁 8/14 号线大世界站上盖',
    why:'价格更稳、近新天地；Day2 结束回程取行李也顺路。' });
  h += '<div class="imgstrip wide"><figure><img src="' + IMG.bund2 + '"/><figcaption>外滩——三店均在步行可达范围</figcaption></figure></div>';
  h += '<div class="tint" style="background:linear-gradient(90deg,#f6efe0,#fbf7ee)"><b class="ti">入住动线建议</b>：Day1 中午前到店寄存行李再出发；Day2 一早退房寄存，傍晚游玩结束回来取。若中午前到不了上海，可把行李直接寄存在地铁站寄存柜，先玩再回酒店办入住。</div>';
  h += '<div class="tint"><b class="ti">预订与入住贴士</b>：① 同一房型平日比周五/中秋前后便宜 20–30%；② 入住 14:00、退房 12:00，可备注延迟退房；③ Day2 一早退房把行李寄存前台，傍晚游玩结束再回来取；④ 自驾停车需另付费，市内建议地铁+打车。</div>';
  h += '<div class="tint" style="background:linear-gradient(90deg,#eef3fb,#fbf7ee)"><b class="ti">同档次备选</b>：全季（人民广场）、桔子水晶（南京东路）、美居（人民广场）——约 ¥450–700/晚。</div>';
  return h;
}

// ============================ DAY 1 ============================
function legHTML(img, cap, title, body){
  let im = '';
  if (img){ im = '<img class="legimg" src="' + img + '" alt=""><span class="legcap">' + cap + '</span>'; }
  return '<div class="legnote"><div class="legl">' + im + '</div><div class="legr"><b>' + title + '</b><br/>' + body + '</div></div>';
}
PAGES.push(itinPage({
  sec: '03 · A', color: '#d64541', title: 'Day 1 · 老城与十里洋场（上）', sub: '上午 08:00–13:10 ｜ 浦西 · 地铁 10 号线为主',
  panels: [
    { num: 1, short: '豫园·城隍庙', title: '豫园 · 城隍庙', time: '09:30–11:20 · 停留约 1h50',
      img: IMG.col_yuyuan, imgCap: '豫园园林 + 城隍庙 · 双图拼', side: 'l',
      chips: [['人流 平日中', 'gray'], ['旺季 ¥40', 'red'], ['周一闭园', 'gold']],
      lead: '明代园林 + 城隍庙商圈：开门即进、11 点前相对空，是避峰拍照的最佳窗口。',
      facts: [
        ['门票', '豫园 ¥40/人（9–11 月旺季）；官方小程序“上海豫园”实名预约、刷身份证入园；城隍庙道观约 ¥10（以现场为准），九曲桥/商城免费'],
        ['交通', '南京东路站乘 10 号线 1 站到豫园站 1 号口，步行约 300 米（早高峰打车反而更慢）'],
        ['看点', '三穗堂、大假山、玉华堂、点春堂；机位：九曲桥畔、玉玲珑、湖心亭倒影'],
        ['开放', '09:00–16:30 · 16:00 停止售票 · 周一闭园（法定节假日除外）'],
      ],
      note: '从酒店（宁波路 586 号）步行约 15 分钟先到大壶春早餐（见下），再乘地铁入园。',
      trans: ['步行 2 分钟', '豫园站 → 南翔（九曲桥畔）'] },
    { num: 2, short: '南翔馒头店', title: '南翔馒头店（豫园店）· 午餐', time: '11:20–13:10 · 约 1h50',
      img: IMG.col_xlb, imgCap: '蟹粉小笼 × 2 · 拼图', side: 'r',
      chips: [['排队 5★', 'red'], ['人均 ¥60', 'gold']],
      lead: '百年老店，小笼之“王”：直接上 2–3 楼堂食，避开一楼外带长队。',
      facts: [
        ['必点', '蟹粉小笼 ¥48/6 只、鲜肉小笼 ¥38/6 只；三楼景观位蟹黄汤包 ¥49/个'],
        ['排队', '指数 5 星，节假日绕九曲桥；11:30 前到基本不等'],
        ['备选', '绿波廊（豫园路 115 号，江南点心）/ 上海老饭店（福佑路 242 号，八宝鸭）'],
      ],
      note: '饭后可逛城隍庙道观与豫园商城；九曲桥夜景适合晚上回来看灯。',
      trans: ['步行 + 骑行 20 分钟', '或地铁 10 号线 1 站 → 南京东路'] },
    { num: 3, short: '南京东路', title: '南京东路步行街', time: '13:40–15:40 · 约 2h',
      img: IMG.nanjing, imgCap: '南京东路 · 百年商业街', side: 'l',
      chips: [['人流 高', 'red'], ['免费', 'gray']],
      lead: '从西往东逛，老建筑集中在河南中路—外滩段，边逛边歇脚。',
      facts: [
        ['看点', '永安/先施/大新“四大公司”老楼立面、世茂广场、第一百货'],
        ['歇脚', '沈大成（糕团/青团）或第一食品商店现做点心；想正餐可提前取号'],
        ['贴士', '周末与傍晚人流更高；14:00–15:30 相对平缓'],
      ],
      trans: ['步行 5 分钟', '南京东路尽头 → 外滩观景平台'] },
  ],
  leg: ['大壶春生煎（早餐 · 四川中路 136 号 · 人均约 ¥29）', '<img class="legimg3" src="' + IMG.sj + '" alt=""/>08:00 从酒店沿南京东路步行约 15 分钟到店，07:00 开始营业、早上不排队：鲜肉生煎约 ¥11/两 + 咖喱牛肉汤，半发面老字号，底脆汁足。吃完沿南京东路原路返回乘 10 号线去豫园。']
}));
PAGES.push(itinPage({
  sec: '03 · B', color: '#d64541', title: 'Day 1 · 老城与十里洋场（下）', sub: '下午 15:50–21:00 ｜ 外滩日落 · 夜游船',
  panels: [
    { num: 4, short: '外滩', title: '外滩 · 万国建筑博览群', time: '15:50–17:30 · 日落机位',
      img: IMG.bund, imgCap: '外滩 · 万国建筑与对岸陆家嘴', side: 'l',
      chips: [['人流 高', 'red'], ['免费', 'gray']],
      lead: '下午到不属最挤，但仍建议 17:30 前占位等日落；18:00 左右亮灯。',
      facts: [
        ['路线', '陈毅广场平台拍陆家嘴 → 折回圆明园路“外滩源”段（人少、和平饭店/海关大楼机位）'],
        ['拍照', '先拍日落后等夜景；夜间江风凉，带薄外套'],
        ['贴士', '观景平台全天开放、无门票；付费拍照与推销一律不理'],
      ],
      note: '想拍干净人像可绕道外滩源或北外滩滨江，人更少。',
      trans: ['步行约 15 分钟', '外滩 → 福州路 556 号老正兴'] },
    { num: 5, short: '老正兴', title: '老正兴菜馆（福州路）· 晚餐', time: '17:45–19:10 · 本帮正餐',
      img: IMG.col_hsr, imgCap: '本帮红烧肉 × 2 · 拼图', side: 'r',
      chips: [['米其林一星', 'gold'], ['人均 ¥150–200', 'red']],
      lead: '1862 年开张的上海本帮名店，油爆虾/响油鳝糊最见功力。',
      facts: [
        ['必点', '油爆虾、草头圈子、响油鳝糊、冰糖甲鱼（时令）'],
        ['预约', '建议提前 1 天电话订座（021-63222624）；未订则 17:00 开餐即到'],
        ['备选', '德兴馆（广东路 471 号，焖蹄面/爆鱼/小笼，人均约 ¥60）'],
      ],
      note: '福州路 556 号，近浙江中路；若 17:00 开餐即到基本无需等位。',
      trans: ['打车约 10 分钟 · ¥18–22', '福州路 → 中山东二路 481 号（十六铺码头）'] },
    { num: 6, short: '十六铺·夜游船', title: '黄浦江夜游船（十六铺码头）', time: '19:20–20:20 · 航程约 45 分钟',
      img: IMG.cruise, imgCap: '黄浦江夜游 · 一江两岸灯光秀', side: 'l',
      chips: [['夜航 ¥140', 'blue'], ['人流 高', 'red']],
      lead: '赶 19:30 班次：提前 20 分钟到码头换纸质票，上甲板先占靠陆家嘴一侧。',
      facts: [
        ['船票', '夜航成人约 ¥140（线上约 ¥110–140，携程/码头售票亭，选 19:30 档）'],
        ['机位', '船尾甲板拍外滩全景、前甲板拍陆家嘴三件套'],
        ['贴士', '航程环线约 45 分钟、原码头上下；21:00 前均有班次约半小时一班'],
      ],
      note: '下船后沿外滩滨江步道步行约 25 分钟回酒店（宁波路 586 号），边看夜景边消食。',
      trans: null },
  ],
  leg: ['夜景收尾二选一', '① 直接回酒店休息；② 体力好可绕道北外滩滨江（白玉兰广场一带）人更少，回望外滩夜景更干净。Day1 两人花费速算：豫园 ¥80 + 午餐约 ¥120 + 晚餐约 ¥300–400 + 夜游船约 ¥280 ≈ ¥780–880。']
}));

// ============================ DAY 2 ============================
PAGES.push(itinPage({
  sec: '04 · A', color: '#1f6feb', title: 'Day 2 · 摩天与梧桐（上）', sub: '上午 08:00–13:15 ｜ 浦东 · 过江地铁 2 号线',
  panels: [
    { num: 1, short: '上海之巅', title: '上海中心 · 上海之巅观光厅', time: '09:00–10:40 · 546m 高空',
      img: IMG.tower, imgCap: '上海中心 · 中国第一高楼', side: 'l',
      chips: [['¥180', 'blue'], ['9:00 早场', 'gold'], ['118–119 层', 'gray']],
      lead: '9:00 第一班进场人最少；分时实名购票后刷码/刷证入园。',
      facts: [
        ['门票', '成人约 ¥180（法定节假日 ¥199；学生 ¥125、儿童 ¥95）；营业 08:30–22:00、21:30 停止入场'],
        ['交通', '08:30 南京东路站乘 2 号线 1 站到陆家嘴，6 号口经环形天桥步行约 12 分钟到银城中路 501 号'],
        ['看点', '360° 俯瞰：朝西拍外滩、朝南拍世博滨江、朝北拍杨浦大桥'],
        ['贴士', '9/10–9/18 期间 126 层“天时”维护关闭，不影响 118 层；有闲可顺路约 239m 朵云书院（世纪朵云公众号提前 3 天）'],
      ],
      note: '为什么不打车：过江早高峰隧道易堵，地铁 1 站 5 分钟解决。',
      trans: ['步行约 15 分钟', '上海中心 → 正大广场旁滨江大道'] },
    { num: 2, short: '滨江大道', title: '陆家嘴滨江大道', time: '10:50–11:40 · 免费',
      img: IMG.lujiazui, imgCap: '陆家嘴三件套 · 天际线', side: 'r',
      chips: [['免费', 'gray'], ['人流 低-中', 'gray']],
      lead: '隔江拍外滩万国建筑全景的最佳免费机位。',
      facts: [
        ['机位', '正大广场前平台与“三件套”合影；沿江步道往北人更少'],
        ['玩法', '可顺路进正大广场逛逛，午餐也在同一栋解决'],
      ],
      trans: ['步行约 5 分钟', '滨江大道 → 正大广场 6F'] },
    { num: 3, short: '上海小南国', title: '上海小南国（正大广场店）· 午餐', time: '12:00–13:15',
      img: IMG.sj_b, imgCap: '上海本帮午餐 · 风味示意', side: 'l',
      chips: [['本帮江浙', 'red'], ['人均 ¥150–200', 'gold']],
      lead: '陆家嘴商圈稳妥的本帮选择：招牌红烧肉、蟹粉豆腐、葱油拌面。',
      facts: [
        ['地址', '正大广场（陆家嘴西路 168 号），滨江步行 5 分钟'],
        ['排队', '12:00–13:00 高峰，建议 12:00 前到或提前取号'],
        ['备选', '桂满陇（正大广场 6F，江浙菜人均约 ¥95）；鼎泰丰（国金 LG1，人均约 ¥120–160，大陆门店收缩中，行前确认在营）'],
      ],
      trans: ['地铁约 35–40 分钟', '2 号线 → 10 号线 → 交通大学站（7 号口步行 5 分钟到武康大楼）'] },
  ],
  leg: ['出发准备', '08:00 酒店早餐（或就近小杨生煎），08:20 前退房并把行李寄存前台；步行约 350 米到南京东路站乘 2 号线。上海之巅建议预约 09:00–10:00 时段。']
}));
PAGES.push(itinPage({
  sec: '04 · B', color: '#1f6feb', title: 'Day 2 · 摩天与梧桐（下）', sub: '下午 13:30–21:00 ｜ 武康路 → 新天地 → 返程',
  panels: [
    { num: 4, short: '武康路', title: '武康路 · 安福路 梧桐漫步', time: '14:20–16:00 · 免费',
      img: IMG.wukang, imgCap: '武康大楼 · 百年梧桐街', side: 'l',
      chips: [['人流 中高', 'gold'], ['免费', 'gray']],
      lead: '上海“梧桐区”精华：百年梧桐 + 老洋房 + 买手店，慢慢逛很治愈。',
      facts: [
        ['机位', '武康大楼路口红砖立面（淮海中路侧，别站马路中央）；武康路 113 号巴金故居门前（外观，故居长期修缮不开放）'],
        ['看点', '安福路小店（多抓鱼、各类生活方式店）；沿途咖啡馆密集，16:00 前光线适合人像'],
        ['贴士', '工作日比周末人少；想避开人群可 9 点前或 17 点后再来'],
      ],
      trans: ['打车约 20–30 分钟 · ¥30–40', '武康路 → 新天地（地铁需换乘较绕）'] },
    { num: 5, short: '新天地·思南', title: '新天地 / 思南公馆 石库门街区', time: '16:40–18:10 · 免费',
      img: IMG.xintiandi, imgCap: '新天地 · 石库门里弄', side: 'r',
      chips: [['傍晚 人流高', 'red'], ['免费', 'gray']],
      lead: '石库门老建筑 + 现代商业，思南公馆花园洋房区更安静。',
      facts: [
        ['看点', '北里/南里弄堂、中共一大会址（免费需预约，可选）、思南路梧桐街'],
        ['机位', '太仓路北里弄堂、马当路路口、思南公馆洋房立面'],
        ['贴士', '拍照赶在亮灯前后；想休息可进弄堂咖啡馆'],
      ],
      trans: ['步行约 5–8 分钟', '新天地 → 圆苑（西藏南路 328 号东台里）'] },
    { num: 6, short: '圆苑晚餐', title: '圆苑（新天地东台里店）· 晚餐', time: '18:30–20:00 · 本帮收尾',
      chips: [['本帮菜', 'red'], ['人均 ¥150–250', 'gold']],
      lead: '上海本帮菜“白月光”：红烧肉与油爆虾都是必点，双人套餐性价比高。',
      facts: [
        ['地址', '西藏南路 328 号 · 新天地东台里商业中心 B 栋 L402a'],
        ['排队', '建议错峰 14:00–17:00 或提前订座；20:00 后仍营业'],
        ['备选', '光明邨大酒家（淮海中路 588 号，人均约 ¥79，常年排队建议早到）'],
      ],
      note: '饭后到新天地北里/太平湖散步看夜景，约 21:00 打车回酒店（约 15 分钟、¥20–30）取行李结束行程。',
      trans: null },
  ],
  leg: ['备选方案', '时间允许可加：① 上午上博东馆/上海博物馆（免费需预约）；② 把武康路换成田子坊+思南公馆；③ 新天地看完夜景加一站淮海中路夜宵。Day2 两人花费速算：上海中心 ¥360 + 午餐约 ¥300–400 + 晚餐约 ¥300–500 ≈ ¥960–1260（另加交通约 ¥80）。']
}));

// ============================ FOOD ============================
function foodHTML(){
  let h = '';
  h += '<div class="secbar" style="--ac:#c9a227"><span class="secno">05</span><div class="secti"><h1>美食清单</h1><div class="sechint">每餐：必吃主选 + 备选 · 排队与预约提示</div></div></div>';

  const rows = [
    ['Day1 早餐','大壶春生煎 · 四川中路136号','鲜肉生煎+咖喱牛肉汤','小杨生煎 / 沈大成','约 ¥29','07:00 开 · 早不排队'],
    ['Day1 午餐','南翔馒头店 · 豫园路87号','蟹粉小笼 ¥48/6只','绿波廊 / 上海老饭店','约 ¥60','上 2–3 楼避开外带'],
    ['Day1 晚餐','老正兴菜馆 · 福州路556号','油爆虾/响油鳝糊','德兴馆（广东路471）','约 ¥150–200','提前 1 天电话订座'],
    ['Day2 午餐','上海小南国 · 正大广场店','红烧肉/蟹粉豆腐','桂满陇 / 鼎泰丰(确认在营)','约 ¥150–200','12:00 前到或取号'],
    ['Day2 晚餐','圆苑 · 西藏南路328号','红烧肉/油爆虾','光明邨（淮海中路588）','约 ¥150–250','错峰或订座'],
    ['随时加餐','沈大成青团 · 第一食品点心','光明邨鲜肉月饼(9月)','沿路小铺','¥10–30','边走边吃'],
  ];
  let tb = '<table class="tbl"><tr><th>餐次</th><th>主选（必吃·特色）</th><th>招牌</th><th>备选</th><th>人均</th><th>排队/预约</th></tr>';
  rows.forEach(function(r){
    tb += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td></tr>';
  });
  tb += '</table>';
  h += tb;
  h += '<div class="tint"><b class="ti">本帮菜点单小抄</b>：2 人份一冷两热一荤一素一主食即可；老字号招牌按只/按位点避免浪费。9 月时令：鲜肉月饼正当季，大闸蟹 10 月最肥，可先尝蟹粉小笼。</div>';
  h += '<div class="tint"><b class="ti">备选替换规则</b>：主选店闭店或排队过久时，就近换同菜系、人均 ±30% 的备选（每餐已列）。</div>';
h += '<div class="tipgrid" style="margin-top:2mm">';
h += '<div class="tipcard"><b>老字号小档案</b>大壶春（1932）＝半发面生煎；南翔馒头店（1900）＝小笼代表，蟹粉款必试；老正兴（1862）＝米其林一星本帮，油爆虾/响油鳝糊见功力；德兴馆＝焖蹄面与德兴爆鱼。</div>';
h += '<div class="tipcard"><b>口味小贴士</b>老正兴/小南国/圆苑偏浓油赤酱的本帮甜咸口；桂满陇/绿波廊偏江浙精细。吃不惯甜口就多点油爆虾、清炒河虾仁、葱油拌面这类咸鲜平衡菜。</div>';
h += '</div>';
  h += '<div class="tipgrid">';
  h += '<div class="tipcard"><b>错峰用餐时段</b>午饭 11:30 前或 13:30 后；晚饭 17:00 开餐或 20:00 后，基本不用排长队。</div>';
  h += '<div class="tipcard"><b>排队最凶怎么躲</b>南翔→直接上 2–3 楼；光明邨→侧面熟食窗；老正兴→提前电话订座；圆苑→错峰 14:00–17:00。</div>';
  h += '</div>';
  h += '<div class="tint"><b class="ti">全天饮食节奏</b>：Day1 生煎早餐 → 豫园商圈蟹粉小笼午餐 → 本帮正餐晚餐；Day2 酒店早餐 → 陆家嘴小南国午餐 → 新天地圆苑晚餐。两餐之间想吃甜口/点心，见“随时加餐”行。</div>';
  return h;
}

// ============================ TIPS ============================
function tipsAHTML(){
  let h = '';
  h += '<div class="secbar" style="--ac:#c9a227"><span class="secno">06 · A</span><div class="secti"><h1>实用贴士 · 预算参考</h1><div class="sechint">出行前 5 分钟读完 · 含预算明细</div></div></div>';
  const tips = [
    ['交通与支付','地铁/公交用支付宝/微信乘车码或“Metro 大都会”；打车用高德/滴滴；备少量现金与身份证。'],
    ['预约清单','豫园（小程序“上海豫园”）+ 上海中心分时票 + 老正兴订座；中共一大会址免费也要预约。'],
    ['天气穿搭','9 月 22–31℃ 闷热有雨：短袖 + 薄外套 + 折叠伞；外滩夜间与高层观景风大。'],
    ['行李安排','Day2 一早退房寄存前台；最后一天去机场/高铁留 60–90 分钟交通余量。'],
    ['避坑提醒','外滩“拍照收费”、景区“开光/老庙黄金”推销一律不理；付费拍照先问清价格。'],
    ['人流口诀','豫园开门就进、南翔直接上楼、外滩 17:30 前占位、武康 9 点前/16 点后、游船提前 20 分钟换票。'],
  ];
  h += '<div class="tipgrid">';
  tips.forEach(function(t){ h += '<div class="tipcard"><b>' + t[0] + '</b>' + t[1] + '</div>'; });
  h += '</div>';
  h += '<div class="h2">预算参考（舒适中档 · 两人 · 9 月平日）</div>';
  const rows = [
    ['门票','约 ¥360/人','豫园 ¥40 + 上海中心 ¥180 + 夜游船约 ¥140（换东方明珠则约 ¥199）'],
    ['餐饮','约 ¥550–700/人','两日三餐 + 小吃；主选店人均 60–250 不等'],
    ['市内交通','约 ¥80–120/人','地铁为主 + 3 段打车（福州路→十六铺、武康→新天地、新天地→酒店）'],
    ['住宿 1 晚','约 ¥350–475/人','亚朵 ¥700–950/间晚 ÷ 2 人'],
    ['两天合计','约 ¥1350–1650/人','≈ ¥675–825/人·天，不含往返大交通与购物'],
  ];
  let tb = '<table class="tbl"><tr><th style="width:22mm">项目</th><th style="width:30mm">金额</th><th>说明</th></tr>';
  rows.forEach(function(r){ tb += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; });
  tb += '</table>';
  h += tb;
  h += '<div class="tint"><b class="ti">费用弹性</b>：想再省——豫园只逛九曲桥免费区域、观景用 2 元轮渡代替、正餐改德兴馆/光明邨，人均可压到 ¥500/天；想升级——晚餐换外滩江景餐厅、住宿换亚朵 S。</div>';
  h += '<div class="h2">每个点“怎么预约”再对一遍</div>';
  h += '<div class="small">· 豫园：小程序“上海豫园”实名预约 → 刷身份证入园（周一闭园）<br/>'
    + '· 上海中心：携程/官方分时票，选 09:00–10:00 时段人最少<br/>'
    + '· 老正兴：提前 1 天电话 021-63222624 订座（17:00 开餐即到也行）<br/>'
    + '· 中共一大会址（可选）：公众号预约，免费<br/>'
    + '· 朵云书院 239m（可选）：世纪朵云公众号提前 3 天约，免费</div>';
  return h;
}
function tipsBHTML(){
  let h = '';
  h += '<div class="secbar" style="--ac:#c9a227"><span class="secno">06 · B</span><div class="secti"><h1>预案 · Q & A · 资料来源</h1><div class="sechint">雨天 / 排队 / 周一 / 伴手礼</div></div></div>';
  h += '<div class="h2">雨天 / 排队预案</div>';
  h += '<div class="tipgrid">';
  h += '<div class="tipcard" style="border-left-color:#1f6feb"><b>下雨去哪</b>豫园商城+城隍庙（有顶棚）、上海中心观景、南京东路商场连廊、上海博物馆/上博东馆（免费预约）、朵云书院、新天地商场。</div>';
  h += '<div class="tipcard" style="border-left-color:#1f6feb"><b>排队太长</b>南翔→绿波廊；老正兴→德兴馆；圆苑→光明邨；豫园人多先逛九曲桥商城再错峰入园。</div>';
  h += '</div>';
  h += '<div class="h2">Q & A</div>';
  h += '<div class="tipgrid">';
  h += '<div class="tipcard"><b>周一出行？</b>豫园园林闭园：改逛城隍庙/豫园商城 + 南京东路；上海中心观景不受周一影响。</div>';
  h += '<div class="tipcard"><b>想压缩行程？</b>Day1 可只逛九曲桥不进豫园；Day2 可用陆家嘴滨江替换武康路。</div>';
  h += '<div class="tipcard"><b>多半天去哪</b>上午加：上博东馆/上海博物馆（免费需预约）；下午加：西岸滨江 + 油罐艺术中心。</div>';
  h += '<div class="tipcard"><b>伴手礼</b>第一食品商店、豫园梨膏糖、国际饭店蝴蝶酥、光明邨鲜肉月饼。</div>';
  h += '</div>';
  h += '<div class="tint"><b class="ti">网络与应急</b>地铁站/商场有公共 Wi-Fi；提前在支付宝开通乘车码或备“Metro 大都会”；随身带身份证，部分场馆需刷证核验。</div>';
  h += '<div class="h2">地铁出口速查</div>';
  h += '<div class="small">豫园站 1 号口 → 豫园/城隍庙 · 南京东路站 2 号口 → 步行街东段 · 陆家嘴站 6 号口 → 上海中心 · 交通大学站 7 号口 → 武康大楼 · 新天地站 3 号口 → 新天地。</div>';
  h += '<div class="h2">夜景灯光时间参考（9 月）</div>';
  h += '<div class="small">外滩亮灯约 18:30 起（以当日为准）；豫园商城灯笼至 22:00；上海之巅可待到 21:30 前入场看夜景。摄影小抄：外滩夜景手持 ISO 1600 / f4 / 1-60s，长曝光找栏杆固定；武康人像选 16:00 前后。</div>';
  h += '<div class="h2">出发前最后核对</div>';
  h += '<div class="small">① 预约截图存手机（豫园/上海中心/老正兴）；② 支付宝开通乘车码并备少量现金；③ 下载离线地图或截图本攻略 07 页；④ 确认返程交通与行李寄存时间。</div>';
  h += '<div class="h2">资料来源（核实日期 2026-09-03）</div>';
  h += '<div class="small">· 携程/Trip.com 社区 2026 攻略与景点页；小红书攻略经聚合源转述（站内需登录无法直连）。<br/>'
    + '· 上海文旅官网 meet-in-shanghai.net、豫园官方小程序、上海中心票务（247/携程）、黄浦江游览票务（aipiao 等）。<br/>'
    + '· 放假安排官方通知（中秋 9/25–27、国庆 10/1–7）、weather-atlas 气候参考。<br/>'
    + '· 餐饮与酒店：携程美食 / 大众点评·美团 / Trip.com·永安·穷游；配图：Wikimedia Commons（CC 授权）与上海文旅素材，个人学习使用；地图底图 © 高德地图。</div>';
  return h;
}
// ============================ MAP ============================
function mapHTML(){
  let h = '';
  h += '<div class="secbar" style="--ac:#c9a227"><span class="secno">07</span><div class="secti"><h1>两日行程地图总览</h1><div class="sechint">高德底图 · 红=Day1 蓝=Day2 · ★=景点 顺序=数字 箭头=走向</div></div></div>';
  h += '<div class="small mb">● 起点酒店：人民广场南京路步行街亚朵（宁波路 586 号）。Day1：豫园·城隍庙 → 南京东路 → 外滩 → 十六铺码头（夜游）；Day2：上海中心 → 武康大楼 · 梧桐区 → 新天地。</div>';
  h += '<div class="mapbox"><img src="' + MAPDATA + '" alt="两日行程地图"/></div>';
  h += '<div class="tint"><b class="ti">出发检查清单</b>：☐ 身份证/手机电量　☐ 豫园预约　☐ 上海中心分时票　☐ 老正兴订座　☐ 乘车码/少量现金　☐ 折叠伞</div>';
  h += '<div class="tint"><b class="ti">怎么看这张图</b>：● 起点酒店（宁波路 586 号）→ ①豫园·城隍庙 → ②南京东路 → ③外滩 → ④十六铺码头·夜游（红=Day1）；①上海中心 → ②武康大楼·梧桐区 → ③新天地（蓝=Day2）。点与点之间的标签＝该段交通方式，对应 03–04 页卡片里的“怎么去”。</div>';
  h += '<div class="tipgrid" style="margin-top:1mm">';
  h += '<div class="tipcard" style="border-left-color:#d64541"><b>Day1 红线口诀</b>豫园开门就进 · 外滩 17:30 前占位 · 19:30 游船提前 20 分钟换票。</div>';
  h += '<div class="tipcard" style="border-left-color:#1f6feb"><b>Day2 蓝线口诀</b>上海之巅 9:00 早场 · 武康 14:30 后光线最好 · 新天地傍晚看灯。</div>';
  h += '</div>';
  h += '<div class="small" style="text-align:center; margin-top:1.5mm">祝你上海之行愉快！本攻略信息核实于 2026-09-03，出行前请以官网当日为准。</div>';
  return h;
}
const CSSX = `
.dsum{background:#fff;border:0.5mm solid var(--line);border-radius:2.5mm;overflow:hidden;box-shadow:0 .8mm 2mm rgba(26,42,74,.07);}
.ds-head{display:flex;align-items:center;gap:3mm;padding:2.4mm 3.6mm;background:linear-gradient(90deg,#fff,#faf4e4);}
.ds-tag{font-family:SimHei;color:#fff;padding:1mm 2.8mm;border-radius:1.4mm;font-size:8.5pt;flex:none;}
.ds-title{font-family:SimHei;font-size:12.5pt;color:var(--navy);}
.ds-route{padding:2mm 3.6mm 0.8mm;font-size:8.2pt;line-height:1.75;color:#333;}
.ds-note{padding:0 3.6mm 2.4mm;font-size:7.4pt;color:#777;}
.hotel{background:#fff;border:0.5mm solid var(--line);border-left:1.8mm solid var(--gold);border-radius:2mm;margin:0 0 2.6mm;padding:2.4mm 3.6mm;box-shadow:0 .6mm 1.8mm rgba(26,42,74,.06);}
.htop{display:flex;align-items:baseline;gap:2.5mm;}
.hname{font-family:SimHei;font-size:12pt;color:var(--navy);}
.htag{font-size:6.6pt;background:var(--gold);color:#fff;padding:.5mm 1.8mm;border-radius:3mm;}
.hprice{margin-left:auto;color:#b03a2e;font-family:SimHei;font-size:10pt;white-space:nowrap;}
.hmeta{font-size:7.3pt;color:#666;margin:1.2mm 0;}
.hwhy{font-size:7.9pt;line-height:1.65;color:#333;}
.tipgrid{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm;margin:1mm 0 1.5mm;}
.tipcard{background:#fff;border:0.4mm solid var(--line);border-left:1.3mm solid var(--gold);border-radius:1.6mm;padding:2mm 2.6mm;font-size:7.6pt;line-height:1.62;color:#333;}
.tipcard b{color:var(--navy);display:block;margin-bottom:.8mm;font-family:SimHei;font-size:8.8pt;}
.mapbox{background:#fff;border:0.6mm solid var(--line);border-radius:2mm;padding:1.6mm;margin:1.5mm 0 2mm;}
.mapbox img{width:100%;display:block;border-radius:1mm;}
.legnote{display:flex;gap:3mm;align-items:stretch;background:#fff;border:0.4mm solid var(--line);border-left:1.8mm solid var(--gold);border-radius:2mm;padding:2.4mm 3.4mm;margin-top:2mm;}
.legl{position:relative;flex:none;width:36mm;}
.legimg{width:100%;height:25mm;object-fit:cover;border-radius:1.4mm;display:block;border:0.4mm solid #fff;box-shadow:0 .6mm 1.6mm rgba(0,0,0,.16);}
.legcap{position:absolute;left:0;right:0;bottom:0;font-size:6pt;color:#fff;background:rgba(0,0,0,.5);border-radius:0 0 1.4mm 1.4mm;padding:.5mm 1mm;text-align:center;}
.legr{font-size:7.7pt;line-height:1.68;color:#444;flex:1;}
.legr b{color:var(--navy);font-size:9pt;font-family:SimHei;}
.pmedia{overflow:hidden;}
.panel .pbody.side-l .pmedia{order:0;}
.panel .pbody.side-r .pmedia{order:2;}
.itinwrap .panels{min-height:1mm;}
`;
const RAILJS = `
(function(){
  function init(){
    var wraps = document.querySelectorAll('.itinwrap');
    for (var i=0;i<wraps.length;i++){ build(wraps[i]); }
  }
  function build(wrap){
    var rail = wrap.querySelector('.rail');
    var panels = wrap.querySelectorAll('.panel');
    if(!rail || !panels.length){ return; }
    var nodes = [];
    try { nodes = JSON.parse(wrap.getAttribute('data-nodes')); } catch(e){}
    rail.innerHTML = '';
    var wrapTop = wrap.getBoundingClientRect().top;
    var tops = [];
    for (var i=0;i<panels.length;i++){
      var r = panels[i].getBoundingClientRect();
      tops.push(r.top - wrapTop + r.height/2);
    }
    var line = document.createElement('div');
    line.className = 'rail-line';
    rail.appendChild(line);
    for (var i=0;i<panels.length;i++){
      var nd = nodes[i] || {};
      var d = document.createElement('div');
      d.className = 'rnode';
      d.style.top = tops[i] + 'px';
      d.style.setProperty('--dot', nd.color || '#c9a227');
      var nm = document.createElement('span');
      nm.className = 'rname';
      nm.textContent = nd.short || '';
      var dot = document.createElement('div');
      dot.className = 'rdot';
      d.appendChild(dot);
      d.appendChild(nm);
      rail.appendChild(d);
    }
    for (var i=0;i<panels.length-1;i++){
      var nd = nodes[i];
      if(!nd || !nd.trans){ continue; }
      var c = document.createElement('div');
      c.className = 'rchip';
      c.style.top = ((tops[i]+tops[i+1])/2) + 'px';
      var ct = document.createElement('span');
      ct.className = 'rct';
      ct.innerHTML = '<b></b>';
      ct.firstChild.textContent = nd.trans[0];
      c.appendChild(ct);
      rail.appendChild(c);
    }
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
`;

const CSSY = `
/* ---------- v2 fills: stretch & scale ---------- */
.content{display:flex;flex-direction:column; bottom:14mm;}
.imgstrip.wide img{height:58mm; object-fit:cover;}
.secbar{flex:none;}
.itinwrap{position:relative; flex:1; min-height:0; display:flex; flex-direction:column;}
.itinwrap .panels{flex:1; min-height:0; display:flex; flex-direction:column; padding-right:14.5mm;}
.panel{flex:1 1 0; display:flex; flex-direction:column; margin-bottom:4.5mm;}
.panel .phead{flex:none;}
.panel .pbody{flex:1; min-height:0;}
.pmedia img{height:100%; object-fit:cover;}
.secbar h1{font-size:17pt;}
.secbar .sechint{font-size:8pt;}
.panel .ptitle{font-size:16.5pt;}
.panel .lead{font-size:9.4pt; line-height:1.9;}
.panel .krow{font-size:8.6pt; line-height:1.78; padding:0.9mm 0;}
.panel .k{min-width:12mm;}
.panel .note{font-size:8.2pt; line-height:1.72;}
.panel .phead{padding:3.2mm 4.6mm;}
.panel .ptime{font-size:7.4pt;}
.panel .chip{font-size:7.2pt; padding:0.8mm 2.2mm;}
.panel .pno{min-width:7.2mm; height:7.2mm; font-size:11pt;}
.panel .ptext{padding:3.4mm 4.2mm;}
.legnote{font-size:8.5pt; line-height:1.72;}
.legr{font-size:8.3pt; line-height:1.78;}
.legr b{font-size:10pt;}
.legl{width:38mm;}
.legimg{height:29mm;}
.tbl td{font-size:8.8pt; padding:2.6mm 3mm; line-height:1.7;}
.tbl th{font-size:9pt; padding:2.4mm 3mm;}
.tint{font-size:9pt; line-height:1.85; padding:3.4mm 4.2mm; margin:3mm 0;}
.tipcard{font-size:8.6pt; line-height:1.78; padding:2.8mm 3.2mm;}
.tipcard b{font-size:9.6pt; margin-bottom:1.2mm;}
.h2{font-size:14pt; margin:4.5mm 0 2.6mm;}
.sub{font-size:9pt;}
.small{font-size:8.2pt; line-height:1.85;}
.ds-route{font-size:9.2pt; line-height:1.9; padding:2.8mm 4.2mm 1.2mm;}
.ds-note{font-size:8.2pt; padding:0 4.2mm 3mm; line-height:1.7;}
.ds-head{padding:3.2mm 4.2mm;}
.ds-title{font-size:14.5pt;}
.hotel{padding:3.2mm 4.2mm; margin-bottom:3.6mm;}
.hname{font-size:13.5pt;}
.hwhy{font-size:8.8pt; line-height:1.85;}
.hmeta{font-size:8.2pt;}
.hprice{font-size:11pt;}
.imgstrip img{height:46mm; object-fit:cover;}
.imgstrip figcaption{font-size:7.6pt; padding-top:1.6mm;}
.mapbox img{width:100%;}
`;

const CSSZ = `.tipcard{font-size:9.3pt; line-height:1.92; padding:3.2mm 3.6mm;}
.tipcard b{font-size:10.4pt;}
.h2{font-size:15pt; margin:3mm 0 1.8mm;}
.mapbox{width:146mm; margin:1.5mm auto 2mm;}
.hotel{margin-bottom:5mm; padding:3.4mm 4.6mm;}
.hwhy{font-size:9pt; line-height:1.9;}
.hmeta{font-size:8.5pt;}
.hname{font-size:14.5pt;}
.hprice{font-size:12pt;}
.legimg3{float:left; width:36mm; height:27mm; object-fit:cover; border-radius:1.8mm; margin:0 3mm 1mm 0; border:0.4mm solid #fff; box-shadow:0 .6mm 1.6mm rgba(0,0,0,.16);}
`;

const CSSZ2 = `
/* ===== art-deco editorial polish layer ===== */
.page{
  background:
    radial-gradient(120% 90% at 88% -8%, rgba(201,162,39,.12), rgba(0,0,0,0) 44%),
    radial-gradient(130% 100% at 0% 110%, rgba(26,42,74,.06), rgba(0,0,0,0) 48%),
    linear-gradient(180deg, #fcf8ef 0%, var(--cream) 18%, #f3ecd9 100%);
}
.topbar{
  background:linear-gradient(180deg,#101b31,#1a2a4a 55%,#2a3f6b);
  box-shadow:0 0.3mm 2mm rgba(10,16,30,.35);
}
.topbar::after{content:""; position:absolute; left:0; right:0; bottom:0; height:0.32mm;
  background:linear-gradient(90deg, rgba(201,162,39,.0), #c9a227 12%, #e5cf86 50%, #c9a227 88%, rgba(201,162,39,0));}
.fbar{background:linear-gradient(180deg,#fbf7ee,#f1e9d6);}
.fbar::before{content:"◆"; position:absolute; left:50%; top:-1.6mm; transform:translateX(-50%);
  color:#c9a227; font-size:2.6mm; background:var(--cream); padding:0 2mm; line-height:1;}
.secbar{border-left-width:0; box-shadow:0 0.8mm 2.6mm rgba(16,26,46,.22);}
.secbar::before{content:""; position:absolute; left:0; top:0; bottom:0; width:1.6mm;
  background:linear-gradient(180deg, var(--ac,#c9a227), rgba(201,162,39,.15));}
.secbar{position:relative; overflow:hidden;}
.secbar::after{content:""; position:absolute; right:-6mm; top:-9mm; width:26mm; height:26mm; border-radius:50%;
  background:radial-gradient(circle, rgba(255,255,255,.12), rgba(255,255,255,0) 70%);}
.panel{border-color:#e0d5bb; box-shadow:0 0 0 0.3mm #fff, 0 0.9mm 2.8mm rgba(16,26,46,.10);}
.panel .phead{background:linear-gradient(90deg, color-mix(in srgb, var(--day,#d64541) 13%, #fff), #fffdf7 60%);}
.panel .phead::after{content:""; position:absolute; left:5mm; right:5mm; bottom:-0.3mm; height:0.3mm;
  background:linear-gradient(90deg, var(--day,#c9a227) 0%, rgba(201,162,39,.0) 78%);}
.panel .pno{box-shadow:0 0 0 0.35mm #fff, 0 0.4mm 1.1mm rgba(10,16,30,.28);}
.panel .pmedia::after{content:""; position:absolute; inset:1.4mm; border:0.28mm solid rgba(255,255,255,.72); pointer-events:none;}
.panel .plabel{font-family:'SimHei'; letter-spacing:.5px;
  background:linear-gradient(0deg, rgba(8,14,28,.78), rgba(8,14,28,0) 88%);}
.ptitle{color:#16233f;}
.ptime{color:#8a6d1f; letter-spacing:.4px;}
.rnode .rdot{background:radial-gradient(circle at 34% 30%, #fff 0 16%, var(--dot,#c9a227) 20% 100%);
  box-shadow:0 0 0 .34mm var(--dot,#c9a227), 0 0 0 .95mm #fff, 0 0.8mm 1.8mm rgba(0,0,0,.2);}
.rail-line{width:0.55mm; background:repeating-linear-gradient(180deg,#c7b98e 0 2.2mm, rgba(199,185,142,0) 2.2mm 3.6mm);}
.rchip .rct{font-family:'SimHei'; font-size:6.1pt; letter-spacing:.2px; border-color:#d8cba8; color:#5a4a2a;}
.imgstrip figure{box-shadow:0 0.7mm 2mm rgba(16,26,46,.08);}
.tbl{border-color:#d9cdb2;}
.tint{box-shadow:0 0.5mm 1.6mm rgba(120,96,40,.06);}
.legnote{border-color:#ded2b6;}
.legimg3,.legimg{border-color:#fbf6ea; box-shadow:0 0.8mm 2.2mm rgba(10,16,30,.2);}
.h2{letter-spacing:.4px;}
.h2::before{border-radius:0.8mm;}
.cover .cv-frame{border-width:1px; border-color:rgba(201,162,39,.6);}
.cover .cv-top{letter-spacing:2.6px;}
.cover .cv-sub{font-family:'SimHei'; letter-spacing:4px;}
.cover .cv-cover{box-shadow:0 0 0 0.9mm rgba(255,255,255,.05), 0 0 0 1.1mm rgba(201,162,39,.28), 0 8mm 18mm rgba(0,0,0,.5);}
.cover h1{letter-spacing:9px;}
`;

const CSSZ3 = `
/* ===== cover fixes ===== */
.cover h1{color:#f6d276; font-size:58pt; letter-spacing:12px; text-shadow:0 0.4mm 1mm rgba(10,16,30,.35), 0 1.2mm 3mm rgba(0,0,0,.45);}
.cover .cv-rule{width:46mm; height:0.5mm; margin:6mm auto 0; background:linear-gradient(90deg, rgba(201,162,39,0), #e6c46a 28%, #f7e3a6 50%, #e6c46a 72%, rgba(201,162,39,0));}
.cover .cv-cover{margin-top:8mm;}
.cover .cv-intro{margin-top:2mm;}
`;

// ============================ ASSEMBLE ============================
var ordered = [coverHTML(), plainPage(overviewHTML()), plainPage(hotelHTML())];
for (var i = 0; i < PAGES.length; i++){ ordered.push(PAGES[i]); }
ordered.push(plainPage(foodHTML()));
ordered.push(plainPage(tipsAHTML()));
ordered.push(plainPage(tipsBHTML()));
ordered.push(plainPage(mapHTML()));
var bodyHtml = ordered.map(function(h, idx){ return h.split('PAGE_NO').join(String(idx + 1)); }).join('');
var full = '<!doctype html><html><head><meta charset="utf-8"><title>上海两日游 · 9月图文攻略</title>'
  + '<style>' + CSS + CSSX + CSSY + CSSZ + CSSZ2 + CSSZ3 + '</style></head><body>' + bodyHtml
  + '<script>' + RAILJS + '<' + '/script></body></html>';
var OUT = path.join(OUTDIR, 'guide.html');
fs.writeFileSync(OUT, full, 'utf8');
console.log('HTML bytes', full.length, 'pages', ordered.length);

