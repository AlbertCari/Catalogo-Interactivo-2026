/* Fondo responsive por orientación (aplica imagen correcta) */
(function(){
  // Como usamos CSS ::before con 2 URLs distintas por media query,
  // aquí no necesitamos JS para cambiar el fondo.
  // Este bloque queda listo por si luego quieres lógica adicional.
})();

/* Inyectar iframe de YouTube con autoplay+loop+controls */
(function(){
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
