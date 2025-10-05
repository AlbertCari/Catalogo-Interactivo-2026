/* ============================================================================
   VIDEOS – Inyección y ajuste de aspecto
   - Ajusta el aspecto del contenedor (.video-frame) según data-aspect o metadatos.
   - Inyecta YouTube (nocookie) con parámetros recomendados.
   - Soporta <video> local: al cargar metadatos, corrige la relación de aspecto.
   - Sin duplicaciones, sin wrappers extra.
   Requisitos de CSS (ya cubiertos en tus estilos):
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
    // Si en el futuro quisieras autoplay, recuerda mantener mute=1 por políticas móviles
    // url.searchParams.set('autoplay', '1');
    url.searchParams.set('mute', '1');
    url.searchParams.set('origin', (location && location.origin) ? location.origin : 'https://albertcari.github.io');

    const iframe = document.createElement('iframe');
    iframe.src = url.toString();
    iframe.title = 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('allowfullscreen', '');
    return iframe;
  }

  /** Informa un fallback simple si el iframe falla por bloqueo de terceros */
  function attachErrorFallback(iframe, hostBox, videoId){
    iframe.addEventListener('error', function(){
      const box = document.createElement('div');
      box.className = 'video-fallback';
      box.style.cssText = 'padding:12px; background:#111; color:#fff; text-align:center;';
      box.innerHTML = 'No se pudo cargar el reproductor. ' +
                      'Abre el video directamente: ' +
                      `<a href="https://youtu.be/${encodeURIComponent(videoId)}" target="_blank" rel="noopener" style="color:#4dd0e1;">ver en YouTube</a>`;
      try {
        hostBox.replaceChildren(box);
      } catch {
        hostBox.appendChild(box);
      }
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
      // Si ya están disponibles las dimensiones
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
