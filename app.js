// Modal de prueba activo + enlaces
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = modal?.querySelector('.modal__close');

function openModal(title, html){
  if(!modal) return;
  if (modalTitle) modalTitle.textContent = title || 'Sección';
  if (modalBody) modalBody.innerHTML = html || '<p>Contenido próximamente…</p>';
  modal.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow='hidden';
}
function closeModal(){
  modal?.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow='';
}
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal?.getAttribute('aria-hidden')==='false') closeModal(); });

document.querySelector('.menu')?.addEventListener('click', (e)=>{
  const a = e.target.closest('.menu__btn');
  if(!a) return;
  e.preventDefault();
  const txt = a.textContent.trim();
  openModal(txt, `<p>Has activado <strong>${txt}</strong>.</p><p><a href="${a.getAttribute('href')}">Ir a ${txt}</a></p>`);
});
