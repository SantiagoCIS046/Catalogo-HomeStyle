// Variables globales para el lightbox
let currentImages = [];
let currentIndex = 0;

// Elementos del DOM
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCounter = document.getElementById("lightbox-counter");

// Abrir lightbox
function openLightbox(title, images) {
  currentImages = images;
  currentIndex = 0;

  lightboxTitle.textContent = title;
  updateLightboxImage();

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Cerrar lightbox
function closeLightbox(event) {
  if (
    event.target === lightbox ||
    event.target.classList.contains("close-btn")
  ) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
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
document.addEventListener("keydown", function (e) {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  } else if (e.key === "ArrowLeft") {
    changeImage(-1);
  } else if (e.key === "ArrowRight") {
    changeImage(1);
  }
});

// Soporte para gestos de swipe en móvil
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener(
  "touchstart",
  function (e) {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true }
);

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

// ========== FILTROS ==========

// Estado de los filtros
let currentCategory = "all";
let currentSize = "all";

// Tallas disponibles por categoría
const sizesByCategory = {
  all: ["S", "M", "L"],
  estampada: ["S", "M", "L"],
  oversize: ["M"],
};

// Inicializar filtros cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  const categoryButtons = document.querySelectorAll(
    ".filter-btn[data-category]"
  );
  const sizeButtonsContainer = document.querySelector(
    ".filter-group:nth-child(2) .filter-buttons"
  );
  const productCards = document.querySelectorAll(".product-card");
  const sections = document.querySelectorAll(".section-title[data-section]");
  const noResultsDiv = document.getElementById("no-results");

  // Event listeners para categorías
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;

      // Actualizar botón activo
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Actualizar botones de talla según categoría
      updateSizeButtons();

      // Aplicar filtros
      applyFilters();
    });
  });

  // Función para actualizar botones de talla según la categoría
  function updateSizeButtons() {
    const availableSizes = sizesByCategory[currentCategory];

    // Crear nuevos botones de talla
    let html =
      '<button type="button" class="filter-btn active" data-size="all">Todas</button>';
    availableSizes.forEach((size) => {
      html += `<button type="button" class="filter-btn" data-size="${size}">${size}</button>`;
    });

    sizeButtonsContainer.innerHTML = html;

    // Resetear talla seleccionada
    currentSize = "all";

    // Agregar event listeners a nuevos botones
    const newSizeButtons = sizeButtonsContainer.querySelectorAll(".filter-btn");
    newSizeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentSize = btn.dataset.size;

        // Actualizar botón activo
        newSizeButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Aplicar filtros
        applyFilters();
      });
    });
  }

  // Función para aplicar filtros
  function applyFilters() {
    let estampadaVisible = 0;
    let oversizeVisible = 0;

    productCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const cardSize = card.dataset.size;

      // Verificar si coincide con los filtros
      const categoryMatch =
        currentCategory === "all" || cardCategory === currentCategory;
      const sizeMatch = currentSize === "all" || cardSize === currentSize;

      if (categoryMatch && sizeMatch) {
        card.classList.remove("hidden");
        if (cardCategory === "estampada") estampadaVisible++;
        if (cardCategory === "oversize") oversizeVisible++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Mostrar/ocultar secciones según productos visibles
    sections.forEach((section) => {
      const sectionType = section.dataset.section;
      const grid = document.querySelector(
        `.products-grid[data-grid="${sectionType}"]`
      );

      if (sectionType === "estampada") {
        section.classList.toggle("hidden", estampadaVisible === 0);
        grid.classList.toggle("hidden", estampadaVisible === 0);
      } else if (sectionType === "oversize") {
        section.classList.toggle("hidden", oversizeVisible === 0);
        grid.classList.toggle("hidden", oversizeVisible === 0);
      }
    });

    // Mostrar mensaje si no hay resultados
    const totalVisible = estampadaVisible + oversizeVisible;
    noResultsDiv.style.display = totalVisible === 0 ? "block" : "none";
  }

  // Inicializar botones de talla
  updateSizeButtons();
});
