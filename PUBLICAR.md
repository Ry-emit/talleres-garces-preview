# Talleres Garcés — cómo editar y publicar la web

Vista previa para enseñar: https://ry-emit.github.io/talleres-garces-preview/
(Google no la indexa: es solo para enseñar.)

---

## 1. Editar textos o fotos

1. Abrir la página que se quiere cambiar en `_build/pages/`:
   - `index.html` → Inicio
   - `nuevo-taller.html` → El nuevo taller
   - `servicios.html` → Servicios
   - `opiniones.html` → Opiniones
   - `donde-estamos.html` → Dónde estamos
   - `legal.html` → Aviso legal y privacidad
2. El texto en catalán de cada página está en el `.ca.json` con el mismo nombre.
3. Generar la web:

```bash
python3 _build/build.py
```

**No editar los `.html` de la raíz**: se sobrescriben cada vez.

Menú, pie, colores y tipografía (comunes a todas las páginas):
- `_build/layout.html` → menú y pie
- `assets/site.css` → estilos
- `assets/site.js` → idioma, reseñas y ajustes

---

## 2. Ajustes rápidos (al principio de `assets/site.js`)

| Qué | Dónde | Ejemplo |
|---|---|---|
| Fecha del traslado | `MOVE_DATE` | `{ es: "el 15 de enero", ca: "el 15 de gener" }` |
| Reseñas guardadas | `REVIEWS` | añadir o quitar `{ n:"Nombre", t:"Texto" }` |
| Reseñas en directo | `GOOGLE_PLACES_KEY` + `GOOGLE_PLACE_ID` | ver punto 4 |

Mientras `MOVE_DATE` esté vacío, la web dice «Próximamente».

---

## 3. Publicar en el dominio del taller

1. En `_build/build.py`, cambiar:
   - `SITE_URL` → el dominio nuevo, acabado en `/`. Ejemplo: `"https://talleresgarcesbcn.com/"`
   - `INDEXABLE` → `True`. Así Google ya puede indexarla y se generan `robots.txt` y `sitemap.xml` buenos.
2. Ejecutar `python3 _build/build.py`.
3. Subir al hosting **solo estos archivos y carpetas**:
   - todos los `.html` de la raíz
   - `assets/`
   - `img/`, **sin** `img/src/`
   - `robots.txt` y `sitemap.xml`
4. Si el hosting no usa `404.html` solo, configurarlo como página de error.
5. En Google Business Profile, cambiar la dirección y poner la web nueva.
6. Dar de alta la web en Google Search Console y enviar `sitemap.xml`.

La web actual (talleresgarcesbcn.com) es un WordPress sin HTTPS. Al cambiarla:
- poner certificado SSL (https)
- redirigir las páginas viejas (`/contacto`, `/nuestras-instalaciones`) a las nuevas

---

## 4. Reseñas en directo (opcional)

Ahora las reseñas son una copia del 26-11-2026. Para que se actualicen solas:

1. Crear una clave de **Places API (New)** en Google Cloud. Necesita una cuenta con facturación; con este uso entra en la parte gratuita.
2. Restringir la clave al dominio de la web.
3. Buscar el **Place ID** del taller en https://developers.google.com/maps/documentation/places/web-service/place-id
4. Pegar la clave y el Place ID en `assets/site.js`.

Google solo devuelve 5 reseñas por consulta. La web las pone delante de las guardadas, y la nota y el número de reseñas se actualizan solos.

---

## 5. Pendiente de confirmar con el taller

- [ ] **Fecha del traslado**
- [ ] **Datos del aviso legal**: razón social «Talleres Garcés Plancha y Pintura, S.L.» y CIF B66660309. Los he sacado de un directorio público de empresas: confirmar que son los suyos.
- [ ] **Reseñas**: que les parece bien mostrarlas con el nombre (o la inicial) de los clientes.
- [ ] **Logo en vectorial**, si tienen. Ahora se usa el nombre con un punto rojo.
- [ ] **Horario** en el taller nuevo. Ahora sale el de siempre: L–V 8–13 y 15–19.

## Notas

- Las matrículas de los coches de clientes están difuminadas en las fotos del taller nuevo.
- Las fotos originales, sin recortar ni difuminar, están en `img/src/`. No se suben a GitHub ni al hosting.
- La tipografía (Inter) está alojada en la propia web, así que no se conecta a Google Fonts.
- El mapa de Google solo se carga cuando el visitante pulsa «Ver el mapa». Hasta entonces no hay cookies de terceros.
