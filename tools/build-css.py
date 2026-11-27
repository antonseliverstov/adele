"""Bundle css/*.css sources into css/site.css and stamp the version into every page.

Edit the source files in css/, then run:  python tools/build-css.py
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
ORDER = ["tokens", "base", "layout", "header", "hero", "page-hero", "home", "news",
         "music", "slider", "gallery", "lightbox", "contact", "footer", "finish", "theme-house"]

parts = []
for name in ORDER:
    src = (ROOT / "css" / f"{name}.css").read_text(encoding="utf-8").strip()
    parts.append(f"/* ===== {name}.css ===== */\n{src}\n")
bundle = "\n".join(parts)
(ROOT / "css" / "site.css").write_text(bundle, encoding="utf-8", newline="\n")
ver = hashlib.sha1(bundle.encode("utf-8")).hexdigest()[:8]

link_re = re.compile(r'<link rel="stylesheet" href="(?:design/[^"]*|css/[a-z-]+\.css(?:\?v=[^"]*)?)">\n')
for page in ROOT.glob("*.html"):
    s = page.read_text(encoding="utf-8")
    if "404" in page.name:
        continue
    s2 = link_re.sub("", s)
    s2 = s2.replace("</head>", f'<link rel="stylesheet" href="css/site.css?v={ver}">\n</head>', 1)
    page.write_text(s2, encoding="utf-8", newline="\n")
print(f"css/site.css  {len(bundle)//1024} KB  v={ver}")
