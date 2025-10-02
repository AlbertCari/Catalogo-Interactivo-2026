/* Fondo responsive según orientación */
(function(){
  const page = document.querySelector('.page--with-bg');
  if(!page) return;
  const applyBG = () => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const src = isPortrait ? page.dataset.bgPortrait : page.dataset.bgLandscape;
    if(src) page.style.setProperty('--bg', `url(${src})`);
    page.style.setProperty('background','transparent');
    page.style.setProperty('position','relative');
    // Pintar en ::before
    page.style.setProperty('--bg-url', `url(${src})`);
    // fallback para browsers: escribir en pseudo vía inline:
    page.style.setProperty('backgroundImage', `url(${src})`);
  };
  applyBG();
  window.addEventListener('resize', applyBG, {passive:true});
})();

/* Inyectar iframe de YouTube con autoplay+loop */
(function(){
  document.querySelectorAll('.video-frame[data-video]').forEach(box=>{
    const id = box.getAttribute('data-video');
    if(!id) return;
    const url = new URL('https://www.youtube.com/embed/'+id);
    url.searchParams.set('autoplay','1');
    url.searchParams.set('mute','1');        // autoplay requiere mute en móviles
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
})();

/* Soporte touch para mostrar botones de edades (C) */
(function(){
  const cards = document.querySelectorAll('.avatar-card');
  if(!cards.length) return;
  cards.forEach(card=>{
    card.addEventListener('click', ()=>{
      // en móvil, primer tap muestra opciones; segundo tap seguirá el enlace
      if(!card.classList.contains('touch')){
        card.classList.add('touch');
        // auto-ocultar después de 5s sin interacción
        setTimeout(()=>card.classList.remove('touch'), 5000);
      }
    });
  });
})();
