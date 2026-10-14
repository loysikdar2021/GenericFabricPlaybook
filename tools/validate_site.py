#!/usr/bin/env python3
"""Structural validator for the playbook site.

    python tools/validate_site.py                 # whole site
    python tools/validate_site.py playbooks/03-*  # a folder or specific files

Checks
  * page boilerplate (data-root, css/js links, one <h1>, ids on h2/h3, <title>)
  * internal links and #anchors resolve
  * every inline <svg>: well-formed XML, viewBox, role="img" + aria-label, wrapped in
    <figure class="diagram"> with <figcaption>, unique ids, resolvable url(#id) refs,
    no <script>/<style>/<foreignObject>, no unescaped HTML entities
  * diagram layout heuristics: text overflowing its box, overlapping text,
    partially overlapping boxes, content outside the viewBox
Exit code 1 if any ERROR is found. WARN lines are advisory but should be reviewed.

Requires: Python 3.8+ and lxml.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

try:
    from lxml import etree
    from lxml import html as lhtml
except ImportError:  # pragma: no cover
    sys.exit("lxml is required: pip install lxml")

ROOT = Path(__file__).resolve().parent.parent
SVG_RE = re.compile(r"<svg\b.*?</svg>", re.S | re.I)
NS = "http://www.w3.org/2000/svg"

errors, warns = [], []


def err(page, msg):
    errors.append(f"ERROR {page}: {msg}")


def warn(page, msg):
    warns.append(f"WARN  {page}: {msg}")


# ------------------------------------------------------------------ helpers
def fnum(v, default=0.0):
    try:
        return float(re.sub(r"[^0-9eE+.\-]", "", str(v)))
    except (ValueError, TypeError):
        return default


def parse_translate(t):
    """Return (dx, dy) for translate(...)-only transforms, else None."""
    if not t:
        return (0.0, 0.0)
    m = re.fullmatch(r"\s*translate\(\s*([-\d.]+)[ ,]*([-\d.]+)?\s*\)\s*", t)
    if not m:
        return None
    return (float(m.group(1)), float(m.group(2) or 0))


def font_size(el):
    cls = (el.get("class") or "").split()
    if el.get("font-size"):
        return fnum(el.get("font-size"), 12)
    st = el.get("style") or ""
    m = re.search(r"font-size:\s*([\d.]+)", st)
    if m:
        return float(m.group(1))
    if "t-lg" in cls:
        return 15
    if "t-h" in cls:
        return 13
    if "t-s" in cls:
        return 11
    if "t-m" in cls:
        return 11
    return 12


def est_width(text, size, cls):
    mono = "t-m" in cls
    bold = any(c in cls for c in ("t-b", "t-h", "t-lg"))
    k = 0.61 if mono else (0.575 if bold else 0.54)
    return len(text) * size * k


# ------------------------------------------------------------------ svg checks
def collect(svg_root):
    """Walk the SVG tree accumulating translate() offsets. Returns rects, texts."""
    rects, texts = [], []

    def walk(node, dx, dy, ok):
        for ch in node:
            if not isinstance(ch.tag, str):
                continue
            tag = etree.QName(ch).localname
            if tag in ("defs", "marker", "title", "desc"):
                continue
            cdx, cdy, cok = dx, dy, ok
            if ch.get("transform"):
                tr = parse_translate(ch.get("transform"))
                if tr is None:
                    cok = False
                else:
                    cdx, cdy = dx + tr[0], dy + tr[1]
            if tag == "rect" and cok:
                x, y = fnum(ch.get("x")) + cdx, fnum(ch.get("y")) + cdy
                w, h = fnum(ch.get("width")), fnum(ch.get("height"))
                rects.append({"x": x, "y": y, "w": w, "h": h, "cls": (ch.get("class") or "").split(), "el": ch})
            elif tag == "text" and cok:
                cls = (ch.get("class") or "").split()
                anchor = ch.get("text-anchor") or "start"
                size = font_size(ch)
                tsp = [t for t in ch if isinstance(t.tag, str) and etree.QName(t).localname == "tspan"]
                lines = []
                if tsp and any(t.get("x") for t in tsp):
                    cy = fnum(ch.get("y")) + cdy
                    for t in tsp:
                        x = fnum(t.get("x", ch.get("x"))) + cdx
                        if t.get("y"):
                            cy = fnum(t.get("y")) + cdy
                        elif t.get("dy"):
                            d = t.get("dy")
                            cy += fnum(d) * (size if d.strip().endswith("em") else 1)
                        tcls = cls + (t.get("class") or "").split()
                        lines.append((x, cy, "".join(t.itertext()), t.get("text-anchor") or anchor, tcls))
                else:
                    lines.append((fnum(ch.get("x")) + cdx, fnum(ch.get("y")) + cdy, "".join(ch.itertext()), anchor, cls))
                for x, y, txt, anc, c in lines:
                    txt = re.sub(r"\s+", " ", txt).strip()
                    if not txt:
                        continue
                    w = est_width(txt, size, c)
                    x0 = x - w / 2 if anc == "middle" else (x - w if anc == "end" else x)
                    texts.append({"x": x, "y": y, "x0": x0, "x1": x0 + w, "y0": y - size * 0.78, "y1": y + size * 0.26,
                                  "txt": txt, "anchor": anc, "size": size, "w": w})
            walk(ch, cdx, cdy, cok)

    walk(svg_root, 0.0, 0.0, True)
    return rects, texts


def check_svg(page, idx, svg_src, page_ids):
    label = f"svg#{idx}"
    try:
        # HTML allows named entities; XML does not.
        if re.search(r"&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)\w+;", svg_src):
            err(page, f"{label}: named HTML entity inside SVG (use the literal character or a numeric entity)")
        src = svg_src
        if "xmlns=" not in src[:300]:
            src = src.replace("<svg", f'<svg xmlns="{NS}"', 1)
        root = etree.fromstring(src.encode("utf-8"))
    except etree.XMLSyntaxError as exc:
        err(page, f"{label}: SVG is not well-formed XML: {exc}")
        return
    aria = root.get("aria-label") or ""
    label = f"svg#{idx} ('{aria[:40]}')"
    vb = root.get("viewBox")
    if not vb:
        err(page, f"{label}: missing viewBox")
        return
    try:
        vx, vy, vw, vh = [float(v) for v in re.split(r"[ ,]+", vb.strip())]
    except ValueError:
        err(page, f"{label}: bad viewBox '{vb}'")
        return
    if vw > 940:
        warn(page, f"{label}: viewBox width {vw:.0f} > 940; text will render small. Keep diagrams 760-900 wide")
    if vh > 700:
        warn(page, f"{label}: viewBox height {vh:.0f} is very tall; split into two figures")
    if root.get("role") != "img":
        err(page, f'{label}: needs role="img"')
    if len(aria) < 15:
        err(page, f"{label}: needs a descriptive aria-label")
    if "dg" not in (root.get("class") or "").split():
        warn(page, f'{label}: svg should carry class="dg"')
    for bad in ("script", "style", "foreignObject", "image"):
        if root.findall(f".//{{{NS}}}{bad}"):
            err(page, f"{label}: <{bad}> is not allowed inside diagrams")
    if root.get("width") or root.get("height"):
        warn(page, f"{label}: remove width/height attributes; size comes from viewBox + CSS")
    hexes = len(re.findall(r'(?:fill|stroke)="#[0-9a-fA-F]{3,8}"', svg_src))
    if hexes:
        warn(page, f"{label}: {hexes} hard-coded colours; use the .box/.ln colour classes so dark mode works")

    ids = [e.get("id") for e in root.iter() if isinstance(e.tag, str) and e.get("id")]
    for i in ids:
        if i in page_ids:
            err(page, f"{label}: duplicate id '{i}' on the page (prefix ids with the figure id)")
        page_ids.add(i)
    local = set(ids)
    for m in re.finditer(r"url\(#([^)]+)\)|href=\"#([^\"]+)\"", svg_src):
        ref = m.group(1) or m.group(2)
        if ref not in local:
            err(page, f"{label}: reference to missing id '{ref}'")

    rects, texts = collect(root)
    # content inside viewBox
    for t in texts:
        if t["x0"] < vx - 1 or t["x1"] > vx + vw + 1 or t["y0"] < vy - 1 or t["y1"] > vy + vh + 1:
            warn(page, f"{label}: text '{t['txt'][:40]}' may fall outside the viewBox")
    for r in rects:
        if r["x"] < vx - 1 or r["y"] < vy - 1 or r["x"] + r["w"] > vx + vw + 1 or r["y"] + r["h"] > vy + vh + 1:
            warn(page, f"{label}: a rect at ({r['x']:.0f},{r['y']:.0f}) extends outside the viewBox")
    # text vs containing rect
    box_like = [r for r in rects if not ({"zone", "lane", "band"} & set(r["cls"])) and r["w"] > 0 and r["h"] > 0]
    for t in texts:
        px, py = t["x"], t["y"] - t["size"] * 0.3
        cont = [r for r in box_like if r["x"] <= px <= r["x"] + r["w"] and r["y"] <= py <= r["y"] + r["h"]]
        if not cont:
            continue
        r = min(cont, key=lambda q: q["w"] * q["h"])
        if t["anchor"] == "middle":
            avail = r["w"] - 8
        elif t["anchor"] == "end":
            avail = t["x"] - r["x"] - 4
        else:
            avail = r["x"] + r["w"] - t["x"] - 4
        if t["w"] > avail * 1.04:
            warn(page, f"{label}: text '{t['txt'][:48]}' (~{t['w']:.0f}px) is wider than its box ({avail:.0f}px available)")
        if t["y1"] > r["y"] + r["h"] + 1.5 or t["y0"] < r["y"] - 1.5:
            warn(page, f"{label}: text '{t['txt'][:48]}' sits across a box edge vertically")
    # text/text overlap
    for i in range(len(texts)):
        a = texts[i]
        for j in range(i + 1, len(texts)):
            b = texts[j]
            ox = min(a["x1"], b["x1"]) - max(a["x0"], b["x0"])
            oy = min(a["y1"], b["y1"]) - max(a["y0"], b["y0"])
            if ox > 3 and oy > 3:
                warn(page, f"{label}: texts '{a['txt'][:30]}' and '{b['txt'][:30]}' overlap")
    # partially overlapping boxes
    bx = [r for r in box_like if "dashed" not in r["cls"]]
    for i in range(len(bx)):
        a = bx[i]
        for j in range(i + 1, len(bx)):
            b = bx[j]
            ox = min(a["x"] + a["w"], b["x"] + b["w"]) - max(a["x"], b["x"])
            oy = min(a["y"] + a["h"], b["y"] + b["h"]) - max(a["y"], b["y"])
            if ox > 2 and oy > 2:
                a_in_b = a["x"] >= b["x"] - 1 and a["y"] >= b["y"] - 1 and a["x"] + a["w"] <= b["x"] + b["w"] + 1 and a["y"] + a["h"] <= b["y"] + b["h"] + 1
                b_in_a = b["x"] >= a["x"] - 1 and b["y"] >= a["y"] - 1 and b["x"] + b["w"] <= a["x"] + a["w"] + 1 and b["y"] + b["h"] <= a["y"] + a["h"] + 1
                if not (a_in_b or b_in_a):
                    warn(page, f"{label}: boxes at ({a['x']:.0f},{a['y']:.0f}) and ({b['x']:.0f},{b['y']:.0f}) partially overlap")


# ------------------------------------------------------------------ page checks
def anchors_of(doc):
    return {e.get("id") for e in doc.iter() if isinstance(e.tag, str) and e.get("id")} | \
           {e.get("name") for e in doc.iter("a") if e.get("name")}


_anchor_cache = {}


def get_anchors(path):
    if path not in _anchor_cache:
        try:
            _anchor_cache[path] = anchors_of(lhtml.parse(str(path)).getroot())
        except Exception:  # noqa: BLE001
            _anchor_cache[path] = set()
    return _anchor_cache[path]


def check_page(path):
    rel = path.relative_to(ROOT).as_posix()
    raw = path.read_text(encoding="utf-8")
    doc = lhtml.fromstring(raw)
    depth = len(Path(rel).parents) - 1
    want_root = "../" * depth

    body = doc.find(".//body")
    if body is None:
        err(rel, "no <body>")
        return
    if (body.get("data-root") or "") != want_root:
        err(rel, f'data-root should be "{want_root}" (found "{body.get("data-root")}")')
    pb = body.get("data-playbook") or ""
    if rel.startswith("playbooks/") and rel.count("/") >= 2 and pb != rel.split("/")[1]:
        err(rel, f'data-playbook should be "{rel.split("/")[1]}"')
    if not body.get("data-page"):
        warn(rel, "missing data-page")
    title = doc.find(".//title")
    if title is None or not (title.text or "").strip():
        err(rel, "missing <title>")
    desc = doc.xpath('//meta[@name="description"]/@content')
    if not desc or len(desc[0]) < 40:
        warn(rel, "meta description missing or too short")
    for needle in ("assets/css/site.css", "assets/js/site-data.js", "assets/js/site.js"):
        if needle not in raw:
            err(rel, f"missing reference to {needle}")
    for needle, idv in (("site-header", "site-header"), ("sidebar", "sidebar"), ("main", "main"), ("toc", "toc"), ("site-footer", "site-footer"), ("layout", "layout")):
        if not doc.xpath(f'//*[@id="{idv}"]'):
            err(rel, f'missing container id="{idv}"')

    h1s = doc.xpath("//main//h1")
    if len(h1s) != 1:
        err(rel, f"expected exactly one <h1> in <main>, found {len(h1s)}")
    for h in doc.xpath("//main//h2|//main//h3"):
        if h.xpath("ancestor::*[contains(@class,'card') or contains(@class,'callout') or contains(@class,'takeaways')]"):
            continue
        if not h.get("id"):
            err(rel, f"<{h.tag}> without id: '{h.text_content().strip()[:50]}'")
    # leftover markers
    for pat in ("TODO", "TBD", "lorem ipsum", "FIXME", "XXX"):
        if re.search(r"\b" + pat + r"\b", re.sub(r"<(script|style|pre)\b.*?</\1>", "", raw, flags=re.S), re.I):
            warn(rel, f"contains '{pat}'")

    # links
    page_anchors = anchors_of(doc)
    for a in doc.iter("a"):
        href = a.get("href")
        if not href or href.startswith(("mailto:", "javascript:", "tel:")):
            continue
        u = urlparse(href)
        if u.scheme in ("http", "https"):
            if "learn.microsoft.com" in u.netloc and re.search(r"/en-us/|/en-gb/", u.path):
                warn(rel, f"locale in Microsoft Learn link (drop /en-us/): {href}")
            continue
        target = path if not u.path else (path.parent / unquote(u.path)).resolve()
        if u.path:
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                err(rel, f"broken link: {href}")
                continue
        if u.fragment and target.suffix == ".html":
            anchors = page_anchors if target == path else get_anchors(target)
            if u.fragment not in anchors:
                err(rel, f"missing anchor in link: {href}")
    for tag, attr in (("img", "src"), ("script", "src"), ("link", "href")):
        for e in doc.iter(tag):
            v = e.get(attr)
            if v and not v.startswith(("http", "data:", "//")):
                p = (path.parent / unquote(urlparse(v).path)).resolve()
                if not p.exists():
                    err(rel, f"missing {tag} {attr}: {v}")

    # figures & svgs
    page_ids = set(e.get("id") for e in doc.iter() if isinstance(e.tag, str) and e.get("id") and etree.QName(e).localname != "svg" and e.getparent() is not None and "svg" not in [etree.QName(p).localname for p in e.iterancestors()])
    svgs = SVG_RE.findall(raw)
    for i, s in enumerate(svgs, 1):
        check_svg(rel, i, s, page_ids)
    n_fig = len(doc.xpath('//figure[contains(@class,"diagram")]'))
    n_cap = len(doc.xpath('//figure[contains(@class,"diagram")]/figcaption'))
    if n_fig != len(svgs):
        warn(rel, f"{len(svgs)} <svg> vs {n_fig} <figure class=\"diagram\">; wrap every diagram in a figure")
    if n_cap < n_fig:
        err(rel, "a diagram figure is missing its <figcaption>")
    return len(svgs)


def main(argv):
    targets = []
    if argv:
        for a in argv:
            p = (Path(a) if Path(a).is_absolute() else Path.cwd() / a)
            if p.is_dir():
                targets += sorted(p.rglob("*.html"))
            elif p.exists():
                targets.append(p)
    else:
        targets = sorted(ROOT.rglob("*.html"))
    targets = [t.resolve() for t in targets if "node_modules" not in t.parts and ".git" not in t.parts]
    total_svg = 0
    for t in targets:
        try:
            n = check_page(t)
            total_svg += n or 0
        except Exception as exc:  # noqa: BLE001
            err(t.relative_to(ROOT).as_posix(), f"validator crashed: {exc!r}")
    for w in warns:
        print(w)
    for e in errors:
        print(e)
    print(f"\n{len(targets)} pages, {total_svg} diagrams checked: {len(errors)} errors, {len(warns)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
