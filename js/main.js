/* =========================
   Catálogo 2026 - Escuela Activa
   JS global (scroll suave, modal, año automático, soporte táctil para overlay)
   ========================= */

// Año automático en footer
(function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Scroll suave para anclas internas (si en el futuro se usan #ids)
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

// Modal de prueba en portada: se abre al hacer click en cualquier botón de la home
(function demoModal(){
  const isHome = document.body.classList.contains('page--home');
  if(!isHome) return;

  const modal = document.getElementById('demoModal');
  if(!modal) return;

  const open = ()=> {
    modal.setAttribute('aria-hidden','false');
    modal.querySelector('.modal__dialog').focus?.();
  };
  const close = ()=> modal.setAttribute('aria-hidden','true');

  // Abre modal al primer click en cualquier .btn-card
  document.querySelectorAll('.btn-card').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      // Abrimos y luego dejamos seguir al enlace (solo demostración si quieres que no interrumpa).
      // Si prefieres bloquear navegación, descomenta el preventDefault:
      // e.preventDefault();
      open();
      // Cierra solo si el usuario lo decide (no forzamos cierre automático).
    }, { once:true });
  });

  modal.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close-modal]') || e.target.classList.contains('modal__backdrop')) close();
  });
})();

// Soporte táctil para mostrar overlay de 4 botones en Inicial
(function inicialTouchOverlay(){
  const isInicial = document.body.classList.contains('page--inicial');
  if(!isInicial) return;

  document.querySelectorAll('.kid-figure').forEach(fig=>{
    let tapped = false;
    fig.addEventListener('click', (e)=>{
      // En móviles: primer tap abre overlay; segundo permite click en botones
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
