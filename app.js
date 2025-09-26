// Interacciones de portada
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = modal?.querySelector('.modal__close');

function openModal(title, html){
  if(!modal) return;
  modalTitle.textContent = title || 'Sección';
  modalBody.innerHTML = html || '<p>Contenido próximamente…</p>';
  modal.setAttribute('aria-hidden', 'false');
  document.documentElement.style.overflow = 'hidden';
}
function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
}
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal?.getAttribute('aria-hidden')==='false') closeModal(); });

document.querySelector('.menu')?.addEventListener('click', (e)=>{
  const btn = e.target.closest('.menu__btn');
  if(!btn) return;
  const key = btn.dataset.key;
  const contenidos = {
    'presentacion':'<p>Bienvenido(a) a <strong>Presentación</strong>.</p>',
    'comunicacion':'<p>Sección <strong>Comunicación</strong>.</p>',
    'eactiva':'<p><strong>Eactiva Plus</strong>.</p>',
    'inicial':'<p>Sección <strong>Inicial</strong>.</p>',
    'ingles':'<p>Sección <strong>Inglés</strong>.</p>',
    'matematica':'<p>Sección <strong>Matemática</strong>.</p>',
    'plan-lector':'<p><strong>Plan Lector</strong>.</p>',
    'plataforma':'<p><strong>Plataforma</strong>.</p>'
  };
  openModal(btn.textContent.trim(), contenidos[key]);
});
