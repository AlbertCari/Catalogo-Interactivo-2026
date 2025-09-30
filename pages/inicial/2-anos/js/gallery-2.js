
document.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && document.activeElement.classList.contains('card-link')){
    document.activeElement.click();
  }
});
