// Modal util
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = modal?.querySelector('.modal__close');

function openModal(title, html){
  if(!modal) return;
  modalTitle.textContent = title || 'Sección';
  modalBody.innerHTML = html || '<p>Contenido próximamente…</p>';
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

// En páginas internas, habilitamos botón de prueba si existe
document.querySelector('[data-test-modal]')?.addEventListener('click', (e)=>{
  e.preventDefault();
  openModal('Prueba', '<p>Este es un modal de prueba. Aquí cargaremos contenido real de la sección.</p>');
});
