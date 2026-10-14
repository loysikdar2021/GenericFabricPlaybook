#!/usr/bin/env python3
"""Regenerate assets/js/site-data.js and assets/js/search-index.js.

Run from the repository root after adding or editing pages:

    python tools/build_site_data.py

Also refreshes the playbook cards between <!-- CATALOG:START --> and
<!-- CATALOG:END --> markers in index.html and playbooks/index.html.

Inputs
  site.config.json                  site title, brand, repo URL, categories
  playbooks/<id>/meta.json          one per playbook (title, summary, pages ...)
  playbooks/<id>/*.html             page content (used for the search index)

Requires: Python 3.8+ and lxml  (pip install lxml)
"""
import json
import re
import sys
from pathlib import Path

try:
    from lxml import html as lhtml
except ImportError:  # pragma: no cover
    sys.exit("lxml is required: pip install lxml")

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "site.config.json"
PLAYBOOKS = ROOT / "playbooks"
OUT_DATA = ROOT / "assets" / "js" / "site-data.js"
OUT_INDEX = ROOT / "assets" / "js" / "search-index.js"

SKIP_TAGS = {"pre", "svg", "script", "style", "nav", "button"}
SNIPPET_LEN = 420


def slug(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:64]
    return s or "section"


def clean(text):
    return re.sub(r"\s+", " ", text or "").strip()


def text_of(el):
    """Visible prose text of an element, skipping code/svg/etc."""
    parts = []

    def walk(node):
        if not isinstance(node.tag, str):
            return
        if node.tag in SKIP_TAGS:
            return
        if node.text:
            parts.append(node.text)
        for child in node:
            walk(child)
            if child.tail:
                parts.append(child.tail)

    walk(el)
    return clean(" ".join(parts))


def load_playbooks(errors):
    books = []
    for meta in sorted(PLAYBOOKS.glob("*/meta.json")):
        try:
            data = json.loads(meta.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{meta}: invalid JSON ({exc})")
            continue
        folder = meta.parent
        data.setdefault("id", folder.name)
        if data["id"] != folder.name:
            errors.append(f"{meta}: id '{data['id']}' must equal folder name '{folder.name}'")
        for key in ("number", "title", "summary", "category", "pages"):
            if key not in data:
                errors.append(f"{meta}: missing '{key}'")
        for pg in data.get("pages", []):
            if not (folder / pg["file"]).exists():
                errors.append(f"{meta}: page file not found: {pg['file']}")
        books.append(data)
    books.sort(key=lambda b: b.get("number", "99"))
    return books


def extract_sections(path, playbook_title, rel_url):
    doc = lhtml.parse(str(path)).getroot()
    main = doc.get_element_by_id("main", None)
    if main is None:
        return []
    h1 = main.find(".//h1")
    page_title = clean(h1.text_content()) if h1 is not None else path.stem
    existing = {e.get("id") for e in doc.iter() if isinstance(e.tag, str) and e.get("id")}
    used = set()
    entries = []
    cur = {"s": "", "id": "", "buf": []}

    def flush():
        txt = clean(" ".join(cur["buf"]))
        if txt or cur["s"]:
            entries.append({
                "u": rel_url + ("#" + cur["id"] if cur["id"] else ""),
                "t": page_title, "s": cur["s"] or page_title, "p": playbook_title,
                "x": txt[:SNIPPET_LEN],
            })

    def walk(node):
        for child in node:
            if not isinstance(child.tag, str):
                continue
            if child.tag in ("h2", "h3"):
                flush()
                htxt = clean(child.text_content()).rstrip("#").strip()
                hid = child.get("id")
                if not hid:
                    base = slug(htxt)
                    hid, n = base, 2
                    while hid in used or hid in existing:
                        hid, n = f"{base}-{n}", n + 1
                used.add(hid)
                cur.update({"s": htxt, "id": hid, "buf": []})
            elif child.tag in SKIP_TAGS:
                continue
            elif child.tag in ("div", "section", "article", "figure", "details", "table", "tbody", "thead", "tr", "ul", "ol", "dl", "li", "aside", "header", "blockquote") and \
                    child.find(".//h2") is None and child.find(".//h3") is None:
                cur["buf"].append(text_of(child))
            elif child.tag in ("div", "section", "article", "details", "header", "aside", "blockquote"):
                walk(child)
            else:
                cur["buf"].append(text_of(child))

    walk(main)
    flush()
    return entries


CAT_COLORS = {"strategy": "purple", "data-engineering": "bronze", "alm": "blue", "analytics": "gold", "governance": "teal"}


def esc(t):
    return (str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


def render_catalog(books, cats, prefix, with_heads):
    """HTML for catalog cards grouped by category. prefix = path from page to site root."""
    out = []
    for cat in cats:
        items = [b for b in books if b.get("category") == cat["id"]]
        if not items:
            continue
        if with_heads:
            out.append(f'<div class="cat-head"><h2 id="cat-{cat["id"]}">{esc(cat["title"])}</h2></div>')
            out.append(f'<p class="cat-blurb">{esc(cat.get("blurb", ""))}</p>')
        out.append('<div class="cards wide">')
        for b in items:
            color = CAT_COLORS.get(b.get("category"), "blue")
            meta = " ".join(f"<span>{esc(x)}</span>" for x in (b.get("level"), b.get("readingTime"), f'{len(b.get("pages", []))} pages') if x)
            out.append(
                f'<a class="card {color}" href="{prefix}playbooks/{b["id"]}/index.html"><span class="card-num">PLAYBOOK {esc(b["number"])}</span>'
                f'<h3>{esc(b["title"])}</h3><p>{esc(b.get("summary", ""))}</p><div class="card-meta">{meta}</div></a>')
        out.append('</div>')
    return "\n".join(out)


def inject(path, html):
    if not path.exists():
        return False
    txt = path.read_text(encoding="utf-8")
    new, n = re.subn(r"(<!-- CATALOG:START -->).*?(<!-- CATALOG:END -->)", lambda m: m.group(1) + "\n" + html + "\n" + m.group(2), txt, flags=re.S)
    if n:
        path.write_text(new, encoding="utf-8")
    return bool(n)


def main():
    errors = []
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    books = load_playbooks(errors)

    site = {
        "title": cfg.get("title", "Playbooks"),
        "brandShort": cfg.get("brandShort", cfg.get("title", "Playbooks")),
        "brandSub": cfg.get("brandSub", ""),
        "repo": cfg.get("repo", ""),
        "categories": cfg.get("categories", []),
        "playbooks": [
            {k: b.get(k) for k in ("id", "number", "title", "short", "summary", "category", "level", "audience", "readingTime", "pages")}
            for b in books
        ],
    }
    OUT_DATA.write_text("window.SITE_DATA = " + json.dumps(site, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")

    cats = cfg.get("categories", [])
    inject(ROOT / "index.html", render_catalog(books, cats, "", True))
    inject(ROOT / "playbooks" / "index.html", render_catalog(books, cats, "../", True))

    index = []
    for b in books:
        folder = PLAYBOOKS / b["id"]
        for pg in b.get("pages", []):
            f = folder / pg["file"]
            if f.exists():
                index.extend(extract_sections(f, b["title"], f"playbooks/{b['id']}/{pg['file']}"))
    OUT_INDEX.write_text("window.SEARCH_INDEX = " + json.dumps(index, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")

    pages = sum(len(b.get("pages", [])) for b in books)
    print(f"site-data.js: {len(books)} playbooks, {pages} pages")
    print(f"search-index.js: {len(index)} sections ({OUT_INDEX.stat().st_size // 1024} KB)")
    if errors:
        print("\nProblems:")
        for e in errors:
            print("  -", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
