/* ============================================================================
   VIDEOS – Inyección y ajuste de aspecto
   - Ajusta el aspecto del contenedor (.video-frame) según data-aspect o metadatos.
   - Inyecta YouTube (nocookie) con parámetros recomendados.
   - Soporta <video> local: al cargar metadatos, corrige la relación de aspecto.
   - Sin duplicaciones, sin wrappers extra.
   Requisitos de CSS:
     .video-frame { position:relative; aspect-ratio:var(--aspect); }
     .video-frame > iframe, .video-frame > video { position:absolute; inset:0; width:100%; height:100%; border:0; }
============================================================================ */
(function(){
  'use strict';

  /** Parsea "W:H" → {w, h}. Devuelve 16:9 si no es válido */
  function parseAspect(attr){
    const raw = (attr || '16:9').trim();
    const m = raw.match(/^(\d+)\s*:\s*(\d+)$/);
    if(!m) return { w:16, h:9 };
    const w = Number(m[1]), h = Number(m[2]);
    if(!(w > 0 && h > 0)) return { w:16, h:9 };
    return { w, h };
  }

  /** Fija el aspect-ratio en variables y atributos para que CSS responda */
  function setAspect(box, w, h){
    box.style.setProperty('--aspect', `${w}/${h}`);
    box.setAttribute('data-aspect', `${w}:${h}`);
  }

  /** Construye un iframe de YouTube (nocookie) con flags sensatos */
  function buildYouTubeIframe(videoId){
    const url = new URL('https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId));
    url.searchParams.set('rel', '0');
    url.searchParams.set('modestbranding', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('controls', '1');
    // Si quisieras autoplay en el futuro, recuerda: autoplay en móvil requiere mute=1
    // url.searchParams.set('autoplay', '1');
    // url.searchParams.set('mute', '1');

    // ✅ origin seguro: si estás abriendo file:// usa tu dominio de Pages
    const safeOrigin = /^https?:/.test(location.protocol) ? location.origin : 'https://albertcari.github.io';
    url.searchParams.set('origin', safeOrigin);

    const iframe = document.createElement('iframe');
    iframe.src = url.toString();
    iframe.title = 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('allowfullscreen', '');
    return iframe;
  }

  /** Fallback simple si el iframe falla por bloqueo de terceros */
  function attachErrorFallback(iframe, hostBox, videoId){
    iframe.addEventListener('error', function(){
      const box = document.createElement('div');
      box.className = 'video-fallback';
      box.style.cssText = 'padding:12px; background:#111; color:#fff; text-align:center;';
      box.innerHTML = 'No se pudo cargar el reproductor. ' +
                      'Abre el video directamente: ' +
                      `<a href="https://youtu.be/${encodeURIComponent(videoId)}" target="_blank" rel="noopener" style="color:#4dd0e1;">ver en YouTube</a>`;
      try { hostBox.replaceChildren(box); } catch { hostBox.appendChild(box); }
    }, { once:true });
  }

  /** Inicializa una .video-frame concreta */
  function initFrame(box){
    // 1) Aspecto desde data-aspect (o 16:9 por defecto)
    const { w, h } = parseAspect(box.getAttribute('data-aspect'));
    setAspect(box, w, h);

    // 2) Inyectar YouTube si hay data-video
    const ytId = box.getAttribute('data-video');
    if (ytId) {
      const iframe = buildYouTubeIframe(ytId);
      attachErrorFallback(iframe, box, ytId);
      box.replaceChildren(iframe);
    }

    // 3) Si hay <video> local, ajusta aspecto según metadatos reales
    const video = box.querySelector('video');
    if (video) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAspect(box, video.videoWidth, video.videoHeight);
      } else {
        video.addEventListener('loadedmetadata', ()=>{
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setAspect(box, video.videoWidth, video.videoHeight);
          }
        }, { once:true });
      }
    }

    // 4) Ajustes opcionales de "cover" (elimina franjas internas con leve zoom)
    const fit = (box.getAttribute('data-fit') || '').trim(); // 'cover' o 'contain'
    if (fit === 'cover') {
      const zoom = parseFloat(box.getAttribute('data-zoom'));
      const offsetY = box.getAttribute('data-offset-y'); // admite 'px' o '%'
      if (!Number.isNaN(zoom) && zoom > 0) box.style.setProperty('--zoom', String(zoom));
      if (offsetY) box.style.setProperty('--offsetY', offsetY);
    }
  }

  /** Inicializa todos los contenedores existentes */
  function initAll(){
    const frames = document.querySelectorAll('.video-frame');
    if(!frames.length) return;
    frames.forEach(initFrame);
  }

  // Ejecuta al cargar (usa defer en el script para asegurar DOM listo)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once:true });
  } else {
    initAll();
  }

  // (Opcional) Si en el futuro insertas .video-frame dinámicamente, activa este observer:
  // const mo = new MutationObserver((muts)=>{
  //   for (const m of muts) {
  //     m.addedNodes && m.addedNodes.forEach(node=>{
  //       if (node && node.nodeType === 1) { // ELEMENT_NODE
  //         if (node.matches && node.matches('.video-frame')) initFrame(node);
  //         node.querySelectorAll && node.querySelectorAll('.video-frame').forEach(initFrame);
  //       }
  //     });
  //   }
  // });
  // mo.observe(document.documentElement, { childList:true, subtree:true });
})();

/* ============================================================================
   Footer global + CTA flotante (sticky-footer real)
   - Inyecta estilos SIEMPRE, exista o no footer.
   - Si hay <footer class="site-footer">, lo normaliza (contenido uniforme).
   - Si no hay, lo crea al final del <main>.
   - CTA (móvil) fija abajo; cuando el footer entra en pantalla, la CTA sube y NO lo tapa.
   - Añade padding-bottom dinámico a la página para que la CTA no cubra contenido.
============================================================================ */
(function(){
  const STYLE_ID = 'ea-footer-css';
  const FOOTER_HTML = `
    <div class="footer-inner">
      <a class="footer-link" href="https://eactiva.pe/" target="_blank" rel="noopener"
         aria-label="Sitio web Escuela Activa (se abre en nueva pestaña)">eactiva.pe</a>
      <span class="sep">•</span>
      <a class="footer-link" href="https://wa.me/51994380249" target="_blank" rel="noopener"
         aria-label="Escribir por WhatsApp al 994 380 249">WhatsApp: 994380249</a>
    </div>
  `;

  function ensureFooterStyles(){
    if (document.getElementById(STYLE_ID)) return;
    const css = `
/* ----- Base footer ----- */
.site-footer{
  margin-top: auto;                 /* clave para sticky-footer dentro de layout flex */
  text-align: center;
}
.site-footer .footer-inner{
  max-width: var(--max, 1100px);
  margin-inline: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0,0,0,.62);
  color: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}
.site-footer .footer-link{
  color: #fff; text-decoration: none; font-weight: 800;
}
.site-footer .footer-link:hover,
.site-footer .footer-link:focus-visible{ text-decoration: underline; outline: none; }
.site-footer .sep{ opacity: .7; }

/* ----- Sticky footer real (sin tocar HTML) ----- */
/* Hacemos que el main sea un contenedor flex vertical que “empuje” el footer al fondo */
.page > main{
  display: flex;
  flex-direction: column;
  min-height: 60vh;                 /* fallback razonable */
}
/* Tu .page ya usa min-height:100svh en CSS global; este padding evita que la CTA tape contenido */
.page{ padding-bottom: var(--cta-pad, 0px); }

/* ----- CTA flotante (solo en móvil) ----- */
@media (max-width: 768px){
  .cta-wrap{
    position: fixed;
    left: 0; right: 0;
    bottom: env(safe-area-inset-bottom);
    z-index: 1000;
    display: flex; flex-wrap: wrap; justify-content: center; align-items: center;
    gap: 12px;
    margin: 0 !important;
    padding: 10px calc(16px + env(safe-area-inset-left))
             calc(10px + env(safe-area-inset-bottom));
    background: rgba(255,255,255,0.32);
    backdrop-filter: blur(6px);
    box-shadow: 0 -8px 24px rgba(0,0,0,.12);
  }
  /* Cuando el footer está visible, la CTA “sube” para no taparlo */
  .cta-wrap.cta--above-footer{
    bottom: calc(env(safe-area-inset-bottom) + var(--footer-h, 80px) + 10px);
  }
}
`;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function normalizeOrCreateFooter(){
    ensureFooterStyles();

    // Si ya existe un footer, normalízalo (Portada u otras páginas)
    let footer = document.querySelector('.site-footer');
    if (footer) {
      footer.classList.add('site-footer');
      footer.setAttribute('role', 'contentinfo');
      footer.innerHTML = FOOTER_HTML;       // unifica contenido
      return footer;
    }

    // Si no existía, créalo e insértalo al final del <main>
    footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('role', 'contentinfo');
    footer.innerHTML = FOOTER_HTML;

    const host =
      document.querySelector('.page > main') ||
      document.querySelector('.page .container') ||
      document.querySelector('.container') ||
      document.body;

    host.appendChild(footer); // footer siempre como último hijo de <main>
    return footer;
  }

  // Medición de CTA + Footer y elevación inteligente de la CTA
  function wireCtaAndFooter(footer){
    const cta = document.querySelector('.cta-wrap');
    const root = document.documentElement;

    // 1) Altura de la CTA para no tapar contenido (padding-bottom dinámico)
    const measureCta = ()=>{
      if (!cta) { root.style.setProperty('--cta-pad','0px'); return; }
      const h = Math.ceil(cta.getBoundingClientRect().height) || 0;
      const pad = window.matchMedia('(max-width: 768px)').matches ? (h + 16) : 0;
      root.style.setProperty('--cta-pad', pad + 'px');
    };
    measureCta();

    const ro = (window.ResizeObserver) ? new ResizeObserver(measureCta) : null;
    ro && cta && ro.observe(cta);
    window.addEventListener('resize', measureCta);

    // 2) Cuando el footer entra, subimos la CTA para no taparlo (solo si hay CTA)
    if (cta && 'IntersectionObserver' in window && footer) {
      const setFooterH = ()=>{
        const fh = Math.ceil(footer.getBoundingClientRect().height) || 80;
        root.style.setProperty('--footer-h', fh + 'px');
      };
      setFooterH();
      window.addEventListener('resize', setFooterH);

      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if (entry.isIntersecting) {
            cta.classList.add('cta--above-footer');
            setFooterH();
          } else {
            cta.classList.remove('cta--above-footer');
          }
        });
      }, { threshold: 0.01 });
      io.observe(footer);
    }
  }

  function init(){
    const footer = normalizeOrCreateFooter();
    wireCtaAndFooter(footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
  window.addEventListener('load', init, { once:true });
})();
