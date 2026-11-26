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
PAGES = ["index", "nuevo-taller", "servicios", "opiniones", "donde-estamos", "legal", "404"]

# ===== AJUSTES DE PUBLICACIÓN =====
# Dirección pública de la web, acabada en "/". Cambiarla al publicar en el dominio del taller.
SITE_URL = "https://ry-emit.github.io/talleres-garces-preview/"
# Mientras sea una vista previa, Google no debe indexarla. Al publicar en su dominio: True.
INDEXABLE = False

JSONLD = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "name": "Talleres Garcés",
    "description": "Taller de plancha y pintura. Reparación integral de carrocerías para turismos, furgonetas y 4x4.",
    "url": SITE_URL,
    "image": SITE_URL + "img/og.jpg",
    "telephone": "+34 934 24 56 45",
    "email": "talleresgarcesbcn@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "C. Miguel Hernández, 96, Pol. Gran Vía 2",
        "postalCode": "08908",
        "addressLocality": "L'Hospitalet de Llobregat",
        "addressRegion": "Barcelona",
        "addressCountry": "ES",
    },
    "openingHoursSpecification": [
        {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:00", "closes": "13:00"},
        {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "15:00", "closes": "19:00"},
    ],
    "areaServed": ["L'Hospitalet de Llobregat", "Barcelona"],
}

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
    html = html.replace("{{site}}", SITE_URL)
    html = html.replace("{{jsonld}}", json.dumps(JSONLD, ensure_ascii=False))
    is404 = name == "404"
    path = "/" + SITE_URL.split("://", 1)[1].split("/", 1)[1]
    html = html.replace("{{base}}", f'<base href="{path}">\n' if is404 else "")
    html = html.replace("{{robots}}", "index, follow" if INDEXABLE and not is404 else "noindex, nofollow")
    url = SITE_URL + ("" if name == "index" else f"{name}.html")
    html = html.replace("{{canonical}}", "" if is404 else f'<link rel="canonical" href="{url}">\n')
    for other in PAGES:
        html = html.replace("{{cur:%s}}" % other, ' aria-current="page"' if other == name else "")
    leftover = re.findall(r"\{\{[^}]+\}\}", html)
    if leftover:
        raise SystemExit(f"{name}: marcadores sin rellenar {leftover}")
    (ROOT / f"{name}.html").write_text(html, encoding="utf-8")
    print(f"ok  {name}.html")

# sitemap.xml y robots.txt
urls = [SITE_URL + ("" if n == "index" else f"{n}.html") for n in PAGES if n not in ("404",)]
(ROOT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n", encoding="utf-8")
(ROOT / "robots.txt").write_text(
    (f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}sitemap.xml\n") if INDEXABLE else "User-agent: *\nDisallow: /\n",
    encoding="utf-8")
print("ok  sitemap.xml, robots.txt")
