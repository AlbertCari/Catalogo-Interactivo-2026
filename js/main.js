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
