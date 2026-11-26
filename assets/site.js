/* Talleres Garcés — script compartido por todas las páginas */

/* ================= AJUSTES =================
   1) Fecha del traslado. Vacío = "Próximamente".
      Ejemplo: { es: "el 15 de enero", ca: "el 15 de gener" }                          */
const MOVE_DATE = { es: "", ca: "" };

/* 2) Reseñas EN DIRECTO desde Google (opcional).
      Con una clave de Google Places API (New), restringida a este dominio, y el
      Place ID del taller, la nota, el número de reseñas y las reseñas se cargan en
      directo. Sin clave se muestran las de abajo (copiadas de Google el 26-11-2026). */
const GOOGLE_PLACES_KEY = "";
const GOOGLE_PLACE_ID   = "";
const GOOGLE_MAPS_URL   = "https://maps.google.com/?cid=10573136797197472079";

const REVIEWS = [
  { n:"Jordi", t:"La gestión de los tiempos fue espectacular: mientras que en el taller oficial me dejaban prácticamente un mes sin coche, aquí coordinaron con el seguro y con las piezas necesarias de forma impecable, y al final estuve solo tres días sin el vehículo." },
  { n:"Cris H.", t:"Espectacular trabajo de Talleres Garcés, ha quedado como nuevo. Buen precio y cumplimiento de plazos. Recomendable al 100%." },
  { n:"CVV", t:"Serios, rápidos y reparación impecable. Hasta han tenido el detalle de lavar y aspirar el coche." },
  { n:"Antonio V.", t:"Súper competentes y amables. Tuvieron muy en cuenta mi condición de persona con movilidad reducida y fueron súper rápidos en repararme un golpe en la parte trasera de mi coche." },
  { n:"Juan Carlos P.", t:"Increíble la profesionalidad, servicio, trabajo bien realizado, información… No se puede pedir más, la verdad. Son auténticos profesionales." },
  { n:"Jordi", t:"Súper profesionales y rápidos. Me han pintado unos roces de aparcamiento en 1 día ¡y como nuevo! Y todo cubierto por el seguro." },
  { n:"Rosa María B.", t:"¡Espectacular! Aparte de rápidos, trabajan muy bien y el dueño muy educado." },
  { n:"Sònia C.", t:"Excelente trato. Tuve una urgencia y Carles no pudo ser más amable, atento y resolutivo. ¡Muchas gracias!" },
  { n:"Patricia M.", t:"Encantada con el taller: organizados, arreglo rápido y ha quedado perfecto. ¡Muchas gracias!" },
  { n:"Tobi C.", t:"Llevé mi coche 3 veces en menos de 6 meses y siempre me lo han dejado excelente. Son rápidos, puntuales, tienen una cabina de secado que les permite realizar los trabajos con velocidad y calidad." },
  { n:"Marcial D.", t:"Trabajo de calidad. Las veces que he llevado el coche me lo han devuelto a tiempo y por el precio convenido, que por cierto es muy razonable. ¡Gente seria!" },
  { n:"Jorge", t:"Personal muy profesional y de trato muy agradable. He quedado encantado con los servicios prestados. Muchísimas gracias." },
  { n:"Anastasiia K.", t:"Tenía una bolladura en una puerta. Me la han arreglado muy rápido y el coche está como nuevo. ¡100% recomendable!" },
  { n:"Belén C.", t:"Muy buen trabajo y la atención impecable. 100% recomendable." },
  { n:"Andrea S.", t:"Reparación súper rápida, resultado excelente y personal profesional y muy agradable. ¡Súper recomendable!" }
];

/* Textos comunes en catalán (cabecera y pie). Cada página añade los suyos en window.PAGE_CA. */
const COMMON_CA = {
  skip:"Saltar al contingut", brandSub:"Tallers",
  navHome:"Inici", navMove:"El nou taller", navServices:"Serveis", navReviews:"Opinions", navWhere:"On som",
  menu:"Menú",
  fAbout:"Taller de planxa i pintura. Reparació integral de carrosseries per a turismes, furgonetes i 4x4.",
  fPages:"Pàgines", fNew:"Nova adreça", fHours:"Horari",
  fHoursTxt:"Dilluns a divendres<br>8:00–13:00 i 15:00–19:00<br>Dissabte i diumenge tancat",
  fMember:"Membre del Gremi de Tallers de Barcelona",
  ratingTxt:"<span data-count></span> ressenyes a Google",
  revAll:"Veure-les totes a Google", revNote:"Ressenyes publicades a Google per clients del taller."
};
const SOON = { es:"muy pronto", ca:"molt aviat" };
const PILL = { es:["A partir de ","Próximamente"], ca:["A partir de ","Properament"] };

let lang = "es", rating = 4.7, count = 80, reviews = REVIEWS;
const T = { es:{}, ca:Object.assign({}, COMMON_CA, window.PAGE_CA || {}) };

document.querySelectorAll("[data-i18n]").forEach(el=>T.es[el.dataset.i18n]=el.textContent);
document.querySelectorAll("[data-i18n-html]").forEach(el=>T.es[el.dataset.i18nHtml]=el.innerHTML);
document.querySelectorAll("[data-i18n-alt]").forEach(el=>T.es[el.dataset.i18nAlt]=el.alt);

const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const STARS = n => '<span class="stars" role="img" aria-label="'+n+' / 5">'+'<svg aria-hidden="true"><use href="#star"/></svg>'.repeat(n)+'</span>';

function renderReviews(){
  document.querySelectorAll("[data-reviews]").forEach(box=>{
    const from = +(box.dataset.from||0), n = +(box.dataset.reviews||6);
    box.innerHTML = reviews.slice(from, from+n).map(r=>
      '<article class="rev">'+STARS(r.s||5)+'<p>«'+esc(r.t)+'»</p><div class="who-r"><span class="av" aria-hidden="true">'+esc((r.n.trim()[0]||"?").toUpperCase())+'</span><span><b>'+esc(r.n)+'</b>'+esc(r.d||"Google")+'</span></div></article>'
    ).join("");
  });
}
function paintNumbers(){
  document.querySelectorAll("[data-rating]").forEach(el=>el.textContent = rating.toLocaleString(lang==="ca"?"ca-ES":"es-ES",{minimumFractionDigits:1,maximumFractionDigits:1}));
  document.querySelectorAll("[data-count]").forEach(el=>el.textContent = count);
}
function setLang(l){
  lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const v=T[l][el.dataset.i18n]; if(v) el.textContent=v;});
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{const v=T[l][el.dataset.i18nHtml]; if(v) el.innerHTML=v;});
  document.querySelectorAll("[data-i18n-alt]").forEach(el=>{const v=T[l][el.dataset.i18nAlt]; if(v) el.alt=v;});
  document.querySelectorAll("[data-when]").forEach(el=>el.textContent = MOVE_DATE[l] || SOON[l]);
  document.querySelectorAll("[data-date-pill]").forEach(el=>el.textContent = MOVE_DATE[l] ? PILL[l][0]+MOVE_DATE[l] : PILL[l][1]);
  document.querySelectorAll(".lang button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.lang===l));
  document.querySelectorAll("[data-google]").forEach(a=>a.href=GOOGLE_MAPS_URL);
  paintNumbers();
  try{localStorage.setItem("garces-lang",l)}catch(e){}
}
document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));

// Menú en móvil
const menuBtn = document.querySelector(".menu-btn"), nav = document.querySelector("nav.main");
if (menuBtn && nav) {
  menuBtn.addEventListener("click",()=>{
    const open = menuBtn.getAttribute("aria-expanded")!=="true";
    menuBtn.setAttribute("aria-expanded", open); nav.classList.toggle("open", open);
  });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape" && nav.classList.contains("open")){ menuBtn.click(); menuBtn.focus(); }});
}

renderReviews();
const q = new URLSearchParams(location.search).get("lang");
let saved=null; try{saved=localStorage.getItem("garces-lang")}catch(e){}
setLang(q==="ca"||q==="es" ? q : (saved || "es"));

// Reseñas en directo (solo si hay clave y Place ID)
if (GOOGLE_PLACES_KEY && GOOGLE_PLACE_ID) {
  fetch("https://places.googleapis.com/v1/places/"+encodeURIComponent(GOOGLE_PLACE_ID)+"?languageCode=es",{
    headers:{ "X-Goog-Api-Key":GOOGLE_PLACES_KEY, "X-Goog-FieldMask":"rating,userRatingCount,reviews" }
  }).then(r=>r.ok?r.json():Promise.reject(r.status)).then(p=>{
    if (p.rating) rating = p.rating;
    if (p.userRatingCount) count = p.userRatingCount;
    paintNumbers();
    const live = (p.reviews||[]).filter(r=>r.rating>=4 && r.originalText && r.originalText.text).map(r=>({
      n:(r.authorAttribution&&r.authorAttribution.displayName)||"Cliente", t:r.originalText.text, s:r.rating, d:r.relativePublishTimeDescription
    }));
    if (live.length >= 3) { reviews = live.concat(REVIEWS); renderReviews(); }
  }).catch(()=>{ /* si falla, se quedan las reseñas guardadas */ });
}
