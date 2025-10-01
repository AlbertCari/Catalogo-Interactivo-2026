/* =========================
   Catálogo 2026 - Escuela Activa
   JS global (scroll suave, modal, año automático, soporte táctil para overlay)
   ========================= */

// Año automático en footer
(function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Scroll suave para anclas internas (#id)
(function smoothScroll(){
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
    }
  });
})();

// Modal de prueba en portada
(function demoModal(){
  const isHome = document.body.classList.contains('page--home');
  if(!isHome) return;

  const modal = document.getElementById('demoModal');
  if(!modal) return;

  const open = ()=> modal.setAttribute('aria-hidden','false');
  const close = ()=> modal.setAttribute('aria-hidden','true');

  // Abrir modal al primer click en cualquier botón (solo demostración)
  document.querySelectorAll('.btn-card').forEach(btn=>{
    btn.addEventListener('click', ()=> open(), { once:true });
  });

  modal.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close-modal]') || e.target.classList.contains('modal__backdrop')) close();
  });
})();

// Soporte táctil: mostrar overlay (4 botones) en Inicial con primer toque
(function inicialTouchOverlay(){
  const isInicial = document.body.classList.contains('page--inicial');
  if(!isInicial) return;

  document.querySelectorAll('.kid-figure').forEach(fig=>{
    let tapped = false;
    fig.addEventListener('click', (e)=>{
      // Primer tap abre overlay; segundo permite click en botones
      if(!tapped){
        e.preventDefault();
        tapped = true;
        fig.classList.add('age-open');
        // Cerrar si toca fuera
        const off = (ev)=>{
          if(!fig.contains(ev.target)){
            fig.classList.remove('age-open');
            tapped = false;
            document.removeEventListener('click', off);
          }
        };
        document.addEventListener('click', off);
      }
    });
  });
})();
