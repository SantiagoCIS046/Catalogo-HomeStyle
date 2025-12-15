// Variables globales para el lightbox
let currentImages = [];
let currentIndex = 0;

// Elementos del DOM
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCounter = document.getElementById('lightbox-counter');

// Abrir lightbox
function openLightbox(title, images) {
  currentImages = images;
  currentIndex = 0;
  
  lightboxTitle.textContent = title;
  updateLightboxImage();
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Cerrar lightbox
function closeLightbox(event) {
  if (event.target === lightbox || event.target.classList.contains('close-btn')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Cambiar imagen
function changeImage(direction, event) {
  if (event) {
    event.stopPropagation();
  }
  
  currentIndex += direction;
  
  if (currentIndex >= currentImages.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = currentImages.length - 1;
  }
  
  updateLightboxImage();
}

// Actualizar imagen del lightbox
function updateLightboxImage() {
  lightboxImg.src = currentImages[currentIndex];
  lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

// Cerrar con tecla Escape y navegar con flechas
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  } else if (e.key === 'ArrowLeft') {
    changeImage(-1);
  } else if (e.key === 'ArrowRight') {
    changeImage(1);
  }
});

// Soporte para gestos de swipe en móvil
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      changeImage(1); // Swipe izquierda = siguiente
    } else {
      changeImage(-1); // Swipe derecha = anterior
    }
  }
}

