# -*- coding: utf-8 -*-
# Generic route map: Amap tiles (GCJ-02) + colored stars/order/arrows + legend.
# Reads map_stops.json: [{short,label,lon,lat,day,order,start?}]
# Usage: python scripts/build_map.py   (run from WORK dir)
import io, json, math, os, time, urllib.parse, urllib.request

BASE = os.getcwd()
MAP_DIR = os.path.join(BASE, "tmp", "guide2", "map")
OUT = os.path.join(MAP_DIR, "map_overview.png")
os.makedirs(MAP_DIR, exist_ok=True)
FONT = "C:/Windows/Fonts/simhei.ttf"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0 Safari/537.36",
      "Referer": "https://www.amap.com/"}
ZOOM = 14
DAY_COLORS = {1: "#D64541", 2: "#1F6FEB"}

def fetch(url, tries=3, timeout=30):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:
            last = e
            time.sleep(1.5 if i == 0 else 4)
    raise last

def wgs_to_gcj(lng, lat):
    import math as m
    a, ee = 6378245.0, 0.00669342162296594323
    def tl(x, y):
        ret = -100.0 + 2*x + 3*y + 0.2*y*y + 0.1*x*y + 0.2*m.sqrt(abs(x))
        ret += (20.0*m.sin(6*x*m.pi) + 20.0*m.sin(2*x*m.pi)) * 2/3
        ret += (20.0*m.sin(y*m.pi) + 40.0*m.sin(y/3*m.pi)) * 2/3
        ret += (160.0*m.sin(y/12*m.pi) + 320*m.sin(y*m.pi/30)) * 2/3
        return ret
    def tn(x, y):
        ret = 300.0 + x + 2*y + 0.1*x*x + 0.1*x*y + 0.1*m.sqrt(abs(x))
        ret += (20.0*m.sin(6*x*m.pi) + 20.0*m.sin(2*x*m.pi)) * 2/3
        ret += (20.0*m.sin(x*m.pi) + 40.0*m.sin(x/3*m.pi)) * 2/3
        ret += (150.0*m.sin(x/12*m.pi) + 300.0*m.sin(x/30*m.pi)) * 2/3
        return ret
    rad = lat/180*m.pi
    magic = 1 - ee*m.sin(rad)*m.sin(rad)
    sm = m.sqrt(magic)
    dLat = (tl(lng-105, lat-35)*2)/3
    dLng = (tn(lng-105, lat-35)*2)/3
    lat2 = lat + (dLat*180)/((a*(1-ee))/(magic*sm)*m.pi)
    lng2 = lng + (dLng*180)/(a/sm*m.cos(rad)*m.pi)
    return lng2, lat2

stops = json.load(open("map_stops.json", encoding="utf-8"))
for s in stops:
    s["gcj"] = wgs_to_gcj(s["lon"], s["lat"])

tile_deg = 360.0 / (2 ** ZOOM)
def lx(lon): return (lon + 180.0) / tile_deg
def ly(lat):
    r = math.radians(lat)
    return (1.0 - math.log(math.tan(r) + 1.0/math.cos(r)) / math.pi) / 2.0 * (2 ** ZOOM)

lons = [s["gcj"][0] for s in stops]
lats = [s["gcj"][1] for s in stops]
M = 0.02
x0 = math.floor(lx(min(lons) - M)); x1 = math.ceil(lx(max(lons) + M))
y0 = math.floor(ly(max(lats) + M)); y1 = math.ceil(ly(min(lats) - M))
nx, ny = int(x1 - x0 + 1), int(y1 - y0 + 1)
print("tiles", nx, "x", ny)

from PIL import Image, ImageDraw, ImageFont
canvas = Image.new("RGB", (nx*256, ny*256), (245, 242, 235))
for tx in range(nx):
    for ty in range(ny):
        X, Y = x0 + tx, y0 + ty
        srv = 1 + ((X*7 + Y*13) % 4)
        url = ("https://webrd0%d.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=%d&y=%d&z=%d" % (srv, X, Y, ZOOM))
        for _ in range(3):
            try:
                b = fetch(url)
                if b[:4] == b"\x89PNG":
                    canvas.paste(Image.open(io.BytesIO(b)).convert("RGB"), (tx*256, ty*256))
                    break
            except Exception:
                time.sleep(1.5)
print("tiles stitched")

pts = {}
for s in stops:
    px = (lx(s["gcj"][0]) - x0) * 256.0
    py = (ly(s["gcj"][1]) - y0) * 256.0
    pts[s["short"]] = (px, py)
pad = 170
xmin = max(0, int(min(p[0] for p in pts.values()) - pad))
xmax = min(canvas.width, int(max(p[0] for p in pts.values()) + pad))
ymin = max(0, int(min(p[1] for p in pts.values()) - pad))
ymax = min(canvas.height, int(max(p[1] for p in pts.values()) + pad))
canvas = canvas.crop((xmin, ymin, xmax, ymax))
pts = {k: (v[0]-xmin, v[1]-ymin) for k, v in pts.items()}
d = ImageDraw.Draw(canvas, "RGBA")
fnum = ImageFont.truetype(FONT, 30)

def star_pts(cx, cy, R):
    pts2 = []
    for i in range(10):
        ang = -math.pi/2 + i*math.pi/5
        r = R if i % 2 == 0 else R*0.45
        pts2.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    return pts2

def arrow(p0, p1, color):
    x0, y0 = p0; x1, y1 = p1
    ang = math.atan2(y1-y0, x1-x0)
    L = 22
    d.line([(x0+(x1-x0)*0.08, y0+(y1-y0)*0.08), (x1-L*math.cos(ang), y1-L*math.sin(ang))], fill=color, width=9)
    a1, a2 = ang+math.radians(150), ang-math.radians(150)
    hl = 24
    d.polygon([(x1, y1), (x1+hl*math.cos(a1), y1+hl*math.sin(a1)), (x1+hl*math.cos(a2), y1+hl*math.sin(a2))], fill=color)

byday = {1: [], 2: []}
for s in stops:
    if not s.get("start"):
        byday[s["day"]].append(s)
start = [s for s in stops if s.get("start")]
for day in (1, 2):
    seq = sorted(byday[day], key=lambda s: s["order"])
    prev = start[0]["short"] if start else None
    for s in seq:
        if prev and prev in pts and s["short"] in pts:
            arrow(pts[prev], pts[s["short"]], DAY_COLORS[day])
        prev = s["short"]

for s in stops:
    if s.get("start"):
        cx, cy = pts[s["short"]]
        hr = 20
        d.ellipse([int(cx-hr), int(cy-hr), int(cx+hr), int(cy+hr)], fill="#3a3a3a", outline="white", width=4)
        d.text((int(cx)-9, int(cy)-16), "起", font=fnum, fill="white")
        continue
    cx, cy = pts[s["short"]]
    col = DAY_COLORS[s["day"]]
    R = 24
    d.polygon(star_pts(int(cx), int(cy), R), fill=col, outline="white", width=3)
    bx, by = cx+26, cy+24
    r2 = 17
    d.ellipse([int(bx-r2), int(by-r2), int(bx+r2), int(by+r2)], fill="white", outline=col, width=3)
    d.text((int(bx-7), int(by-22)), str(s["order"]), font=fnum, fill=col)

# legend strip
legH = 150 + 44 * (len(byday[1]) + len(byday[2]))
img2 = Image.new("RGB", (canvas.width, canvas.height + legH), "#f7f4ed")
img2.paste(canvas, (0, 0))
d2 = ImageDraw.Draw(img2)
fbig = ImageFont.truetype(FONT, 46)
fmed = ImageFont.truetype(FONT, 32)
fsm = ImageFont.truetype(FONT, 26)
d2.rectangle([0, canvas.height, img2.width, img2.height], fill="#f7f4ed")
d2.line([(0, canvas.height), (img2.width, canvas.height)], fill="#c9c2b4", width=3)
d2.text((60, canvas.height+12), "两日行程地图总览（高德底图）", font=fbig, fill=(26, 42, 74))
y = canvas.height + 92
for day in (1, 2):
    seq = sorted(byday[day], key=lambda s: s["order"])
    txt = "Day %d：%s" % (day, "  →  ".join("%d%s" % (s["order"], s["short"]) for s in seq))
    d2.rectangle([60, y+4, 92, y+36], fill=DAY_COLORS[day])
    d2.text((108, y), txt, font=fmed, fill=(51, 51, 51))
    y += 48
if start:
    d2.text((60, y), "起点：" + start[0]["label"], font=fsm, fill=(120, 120, 120))
    y += 40
d2.text((60, y), "★ 数字为当天顺序，箭头为走向（红色 Day1 / 蓝色 Day2）", font=fsm, fill=(120, 120, 120))
img2.save(OUT, "PNG")
print("SAVED", OUT, img2.size)
