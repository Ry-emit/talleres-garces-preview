"""Monta las páginas de la web a partir de _build/layout.html y _build/pages/.

Cada página tiene dos archivos en _build/pages/:
  <nombre>.html     -> primera línea: <!-- {"title": "...", "desc": "..."} -->, después el contenido
  <nombre>.ca.json  -> textos en catalán de esa página (clave data-i18n -> texto)

Uso:  python3 _build/build.py     (escribe <nombre>.html en la raíz de la web)
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "_build"
PAGES = ["index", "nuevo-taller", "servicios", "opiniones", "donde-estamos"]

layout = (BUILD / "layout.html").read_text(encoding="utf-8")

for name in PAGES:
    src = (BUILD / "pages" / f"{name}.html").read_text(encoding="utf-8")
    m = re.match(r"\s*<!--\s*(\{.*?\})\s*-->\s*\n", src, re.S)
    if not m:
        raise SystemExit(f"{name}.html: falta la línea de cabecera con title/desc")
    meta = json.loads(m.group(1))
    body = src[m.end():]
    ca_path = BUILD / "pages" / f"{name}.ca.json"
    ca = json.loads(ca_path.read_text(encoding="utf-8")) if ca_path.exists() else {}

    html = layout
    html = html.replace("{{title}}", meta["title"]).replace("{{desc}}", meta["desc"])
    html = html.replace("{{body}}", body.rstrip())
    html = html.replace("{{ca}}", json.dumps(ca, ensure_ascii=False))
    for other in PAGES:
        html = html.replace("{{cur:%s}}" % other, ' aria-current="page"' if other == name else "")
    leftover = re.findall(r"\{\{[^}]+\}\}", html)
    if leftover:
        raise SystemExit(f"{name}: marcadores sin rellenar {leftover}")
    (ROOT / f"{name}.html").write_text(html, encoding="utf-8")
    print(f"ok  {name}.html")
