/* Fondo responsive por orientación (aplica imagen correcta) */
(function(){
  // Como usamos CSS ::before con 2 URLs distintas por media query,
  // aquí no necesitamos JS para cambiar el fondo.
  // Este bloque queda listo por si luego quieres lógica adicional.
})();

/* Inyectar iframe de YouTube con autoplay+loop+controls */
/*(function(){
  document.querySelectorAll('.video-frame[data-video]').forEach(box=>{
    const id = box.getAttribute('data-video');
    if(!id) return;
    const url = new URL('https://www.youtube.com/embed/'+id);
    url.searchParams.set('autoplay','1');
    url.searchParams.set('mute','1');        // autoplay en móvil requiere mute
    url.searchParams.set('controls','1');
    url.searchParams.set('playsinline','1');
    url.searchParams.set('loop','1');
    url.searchParams.set('playlist', id);    // necesario para loop
    url.searchParams.set('rel','0');
    const iframe = document.createElement('iframe');
    iframe.src = url.toString();
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.title = 'Video de propuesta pedagógica';
    box.replaceChildren(iframe);
  });
})();*/

/***********NEW******************/

// Inyecta YouTube y ajusta aspecto (9:16, 16:9, 1:1)
(function(){
  document.querySelectorAll('.video-frame').forEach(box=>{
    // 1) Aspecto desde data-aspect
    const aspect = (box.getAttribute('data-aspect') || '9:16').trim();
    const [w, h] = aspect.split(':').map(Number);
    if (w > 0 && h > 0) {
      box.style.setProperty('--aspect', `${w}/${h}`);
    }

    // 2) Si hay data-video => YouTube
    const id = box.getAttribute('data-video');
    if (id) {
      const url = new URL('https://www.youtube.com/embed/' + id);
      url.searchParams.set('autoplay','1');
      url.searchParams.set('mute','1');         // autoplay en móvil requiere mute
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

    // 3) Si en vez de YouTube usas <video>, también puedes ajustar automáticamente
    //    el aspecto con sus metadatos:
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



/**********************************/

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
