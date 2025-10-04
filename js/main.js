/* Inyecta YouTube y ajusta aspecto (16:9 por defecto, 9:16 o 1:1 si se indica) */
(function(){
  document.querySelectorAll('.video-frame').forEach(box=>{
    // 1) Aspecto desde data-aspect (por defecto 16:9)
    const aspectAttr = (box.getAttribute('data-aspect') || '16:9').trim();
    const [w, h] = aspectAttr.split(':').map(Number);
    if (w > 0 && h > 0) {
      box.style.setProperty('--aspect', `${w}/${h}`);
    }

    // 2) Inyectar YouTube si hay data-video
    const id = box.getAttribute('data-video');
    if (id) {
      const url = new URL('https://www.youtube.com/embed/' + id);
      url.searchParams.set('autoplay','1');
      url.searchParams.set('mute','1');         // autoplay en móvil
      url.searchParams.set('controls','1');
      url.searchParams.set('playsinline','1');
      url.searchParams.set('loop','1');
      url.searchParams.set('playlist', id);     // necesario para loop
      url.searchParams.set('rel','0');

      const iframe = document.createElement('iframe');
      iframe.src = url.toString();
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.title = 'Video';
      box.replaceChildren(iframe);
    }

    // 3) Si usas <video> local, auto-ajusta el aspecto según metadatos
    const video = box.querySelector('video');
    if (video) {
      video.addEventListener('loadedmetadata', ()=>{
        const vw = video.videoWidth, vh = video.videoHeight;
        if (vw > 0 && vh > 0) {
          box.style.setProperty('--aspect', `${vw}/${vh}`);
        }
      }, { once:true });
    }
  });
})();

/* Soporte touch para mostrar botones de edades (niño/niña) */
(function(){
  const cards = document.querySelectorAll('.avatar-card');
  if(!cards.length) return;
  cards.forEach(card=>{
    card.addEventListener('click', ()=>{
      if(!card.classList.contains('touch')){
        card.classList.add('touch');
        setTimeout(()=>card.classList.remove('touch'), 5000);
      }
    });
  });
})();

/*******************************************************************************/
(function(){
  function initVideoEmbeds(){
    var frames = document.querySelectorAll('.video-frame');
    if(!frames.length) return;

    var ORIGIN = (location && location.origin) ? location.origin : 'https://albertcari.github.io';

    frames.forEach(function(slot){
      var id = slot.getAttribute('data-video');
      if(!id){ return; }

      var aspect = slot.getAttribute('data-aspect') || '16:9';

      // Crea el contenedor responsivo
      var wrapper = document.createElement('div');
      wrapper.className = 'video-wrapper';
      wrapper.setAttribute('data-aspect', aspect);

      // Construye el src seguro (nocookie + origin + flags)
      var params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        enablejsapi: '1',
        origin: ORIGIN
      });

      var src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?' + params.toString();

      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('title', 'Video de YouTube');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      );
      // clave para evitar el “Error 153” por políticas de referencia
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');

      // Fallback si algo bloquea el embed (adblock/CSP)
      iframe.addEventListener('error', function(){
        showFallback(slot, id);
      });

      // Inserta en DOM
      wrapper.appendChild(iframe);
      slot.replaceWith(wrapper);
    });
  }

  function showFallback(anchorNode, videoId){
    var box = document.createElement('div');
    box.className = 'video-fallback';
    box.innerHTML =
      'No se pudo cargar el reproductor aquí. ' +
      'Puede que un bloqueador o la configuración del navegador haya impedido el *embed*. ' +
      'Prueba en modo incógnito o abre el video directamente: ' +
      '<a href="https://youtu.be/'+ encodeURIComponent(videoId) +'" target="_blank" rel="noopener">ver en YouTube</a>.';
    // Inserta después del nodo original si aún existe
    (anchorNode.parentNode || document.body).appendChild(box);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initVideoEmbeds);
  } else {
    initVideoEmbeds();
  }
})();
