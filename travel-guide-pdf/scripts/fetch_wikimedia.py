# -*- coding: utf-8 -*-
# Generic Wikimedia Commons downloader.
# Reads images.json (key -> query or [queries]) from the working dir (or --file).
import io, json, os, re, sys, time, urllib.parse, urllib.request

BASE = os.getcwd()
PHOTO = os.path.join(BASE, "tmp", "guide2", "photos")
os.makedirs(PHOTO, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0 Safari/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9"}

def fetch(url, timeout=45, tries=4):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:
            last = e
            time.sleep(20 if getattr(e, "code", None) == 429 else 6)
    raise last

cfg_file = sys.argv[1] if len(sys.argv) > 1 else "images.json"
cfg = json.load(open(cfg_file, encoding="utf-8"))
MP = os.path.join(PHOTO, "manifest.json")
manifest = json.load(open(MP, encoding="utf-8")) if os.path.exists(MP) else {}
used = set(v.get("title", "") for v in manifest.values())
api = "https://commons.wikimedia.org/w/api.php"

def pick(key, qs):
    for q in qs if isinstance(qs, list) else [qs]:
        params = {"action": "query", "generator": "search", "gsrsearch": "filetype:bitmap " + q,
                  "gsrnamespace": "6", "gsrlimit": "18", "prop": "imageinfo",
                  "iiprop": "url|size|extmetadata", "iiurlwidth": "1800", "format": "json"}
        try:
            data = json.loads(fetch(api + "?" + urllib.parse.urlencode(params)).decode("utf-8"))
        except Exception as e:
            print(key, "query fail", e)
            continue
        cands = []
        for p in data.get("query", {}).get("pages", {}).values():
            ii = p.get("imageinfo", [{}])[0]
            w, h = ii.get("width", 0), ii.get("height", 0)
            t = p.get("title", "")
            if t in used or w < 1000:
                continue
            if w >= h * 0.9:
                cands.append((w, ii, t))
        cands.sort(key=lambda x: -x[0])
        if cands:
            return cands[0][1], cands[0][2]
        time.sleep(2)
    return None, None

for key, qs in cfg.items():
    if key in manifest:
        print("skip existing", key)
        continue
    ii, title = pick(key, qs)
    if ii is None:
        print("NO IMAGE", key)
        continue
    thumb = ii.get("thumburl") or ii.get("url")
    b = fetch(thumb)
    local = os.path.join(PHOTO, key + ".jpg")
    open(local, "wb").write(b)
    meta = ii.get("extmetadata", {})
    artist = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", ""))
    manifest[key] = {"file": local, "title": title, "artist": artist.strip()[:160],
                     "license": meta.get("LicenseShortName", {}).get("value", ""),
                     "source_url": ii.get("descriptionurl", ""),
                     "width": ii.get("width"), "height": ii.get("height")}
    used.add(title)
    print(key, len(b) // 1024, "KB <-", title)
    time.sleep(8)
json.dump(manifest, open(MP, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("DONE", len(cfg))
