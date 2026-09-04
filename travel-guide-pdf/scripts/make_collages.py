# -*- coding: utf-8 -*-
# Generic: crop singles to 4:3 into processed/, and build 2-tile rounded collages.
# Reads collages.json: {"singles": [keys...], "collages": {"col_x.jpg": ["a","b"], ...}}
import json, os
from PIL import Image, ImageDraw

BASE = os.getcwd()
SRC = os.path.join(BASE, "tmp", "guide2", "photos")
DST = os.path.join(BASE, "tmp", "guide2", "processed")
os.makedirs(DST, exist_ok=True)

def cover_crop(im, arw, arh):
    w, h = im.size
    t = arw / arh
    cur = w / h
    if cur > t:
        nw = int(h * t)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / t)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    return im

def save(im, path, mw=1500, q=85):
    if im.width > mw:
        im = im.resize((mw, int(im.height * mw / im.width)), Image.LANCZOS)
    im.save(path, "JPEG", quality=q, optimize=True)
    return im.size

def rounded(im, rad):
    mask = Image.new("L", im.size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], radius=rad, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out

def load(key):
    p = os.path.join(DST, key + ".jpg")
    if not os.path.exists(p):
        p = os.path.join(SRC, key + ".jpg")
    return Image.open(p).convert("RGB")

cfg = json.load(open("collages.json", encoding="utf-8"))
for key in cfg.get("singles", []):
    if not os.path.exists(os.path.join(SRC, key + ".jpg")):
        print("MISS", key)
        continue
    im = cover_crop(load(key), 4, 3)
    print("single", key, save(im, os.path.join(DST, key + ".jpg")))

for out, (a, b) in cfg.get("collages", {}).items():
    W, H, pad, gap, rad = 1600, 1200, 14, 18, 26
    half = (W - 2 * pad - gap) // 2
    canvas = Image.new("RGB", (W, H), "#f3ead6")
    def place(key, x, y, w, h):
        t = cover_crop(load(key), w, h).resize((w, h), Image.LANCZOS)
        t = rounded(t, rad)
        canvas.paste(t, (x, y), t)
    place(a, pad, pad, half, H - 2 * pad)
    place(b, pad + half + gap, pad, half, H - 2 * pad)
    print("collage", out, save(canvas, os.path.join(DST, out), mw=1600, q=86))
print("DONE")
