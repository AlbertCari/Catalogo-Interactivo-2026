/* =========================
   main.js
   Catálogo Interactivo 2026 - Escuela Activa
   ========================= */

/* 
📌 FUNCIONES PRINCIPALES INCLUIDAS:
1. Botones de navegación globales (🏠, ⬅️)
2. Compatibilidad táctil para botones hover (niño/niña)
3. Animaciones suaves en aparición de elementos
4. Carga diferida de imágenes (lazy loading)
5. Scroll suave para botones internos
*/

// --------------- 1. NAVEGACIÓN GLOBAL ---------------
document.addEventListener("DOMContentLoaded", () => {
  const homeButtons = document.querySelectorAll(".home-icon");
  const backButtons = document.querySelectorAll(".back-icon");

  homeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "../index.html";
    });
  });

  backButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      window.history.back();
    });
  });
});

// --------------- 2. HOVER INTERACTIVO (TOUCH + MOUSE) ---------------
document.addEventListener("DOMContentLoaded", () => {
  const characterCards = document.querySelectorAll(".character-card");

  characterCards.forEach(card => {
    const hoverButtons = card.querySelector(".hover-buttons");
    let isTouched = false;

    // Modo táctil (móvil/tablet)
    card.addEventListener("touchstart", e => {
      if (!isTouched) {
        hoverButtons.style.opacity = "1";
        hoverButtons.style.visibility = "visible";
        isTouched = true;
        setTimeout(() => (isTouched = false), 2000);
      }
    });

    // Modo mouse (desktop)
    card.addEventListener("mouseenter", () => {
      hoverButtons.style.opacity = "1";
      hoverButtons.style.visibility = "visible";
    });

    card.addEventListener("mouseleave", () => {
      hoverButtons.style.opacity = "0";
      hoverButtons.style.visibility = "hidden";
    });
  });
});

// --------------- 3. EFECTOS DE ENTRADA SUAVE ---------------
document.addEventListener("DOMContentLoaded", () => {
  const animatedItems = document.querySelectorAll(".btn-card, .btn-age, .gallery-item, .btn-libros");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedItems.forEach(item => {
    observer.observe(item);
  });
});

// --------------- 4. LAZY LOADING DE IMÁGENES ---------------
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        lazyObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    lazyObserver.observe(img);
  });
});

// --------------- 5. SCROLL SUAVE PARA BOTONES INTERNOS ---------------
document.addEventListener("DOMContentLoaded", () => {
  const smoothLinks = document.querySelectorAll('a[href^="#"]');

  smoothLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth"
        });
      }
    });
  });
});
