// Toggle panels on click/tap and keyboard
function setupPanels(){
  document.querySelectorAll('.unit-card').forEach(card => {
    const panel = card.nextElementSibling;
    if(!panel || !panel.classList.contains('age-panel')) return;

    card.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if(card.contains(e.target) || panel.contains(e.target)) return;
      if(card.classList.contains('is-open')){
        card.classList.remove('is-open');
        card.setAttribute('aria-expanded','false');
      }
    });

    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        card.click();
      }
    });
  });
}
window.addEventListener('DOMContentLoaded', setupPanels);

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.age-btn');
  if(!btn) return;
  e.preventDefault();
  alert('Abrir contenido: ' + btn.dataset.age + ' años');
});
