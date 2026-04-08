'use strict';

const carousel = document.getElementById('reviewsCarousel');
const track = document.getElementById('carouselTrack');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

if (!carousel || !track || !nextBtn || !prevBtn) {
    console.warn('Carrusel de reseñas no inicializado: faltan elementos clave en el DOM.');
} else {
    let testimonials = getTestimonialsFromMarkup();
    let currentSlide = 0;
    let itemsPerView = getItemsPerView();
    let isAnimating = false;

    if (testimonials.length > 0) {
        carousel.classList.add('is-enhanced');
        renderCards();
        updateTrackPosition(true);
    }

    function getTestimonialsFromMarkup() {
        return [...track.querySelectorAll('.carousel__card')].map((card) => {
            const image = card.querySelector('.carousel__card-img');
            const name = card.querySelector('.carousel__card-name');
            const position = card.querySelector('.carousel__card-role');
            const description = card.querySelector('.carousel__card-desc');

            return {
                image: image?.getAttribute('src') ?? '',
                name: name?.textContent?.trim() ?? '',
                position: position?.textContent?.trim() ?? '',
                description: description?.textContent?.trim() ?? ''
            };
        });
    }

    function getItemsPerView() {
        const width = window.innerWidth;
        if (width >= 1024) return 3;
        if (width >= 600) return 2;
        return 1;
    }

    function renderCards() {
        track.innerHTML = '';
        const prefix = testimonials.slice(-itemsPerView);
        const suffix = testimonials.slice(0, itemsPerView);
        const all = [...prefix, ...testimonials, ...suffix];

        all.forEach((t) => {
            const card = document.createElement('div');
            card.className = 'carousel__card';
            card.innerHTML = `
      <div class="carousel__card-inner">
        <img
          src="${t.image}"
          alt="${t.name}"
          class="carousel__card-img"
          width="100"
          height="100"
          loading="lazy"
          decoding="async"
        />
        <h3 class="carousel__card-name">${t.name}</h3>
        <h4 class="carousel__card-role">${t.position}</h4>
        <p class="carousel__card-desc">${t.description}</p>
      </div>`;
            track.appendChild(card);
        });
    }

    function updateTrackPosition(instant = false) {
        const firstCard = track.querySelector('.carousel__card');
        if (!firstCard) return;
        if (isAnimating && !instant) return;

        isAnimating = !instant;

        const slideWidth = firstCard.offsetWidth;
        const target = -((currentSlide + itemsPerView) * slideWidth);

        track.style.transition = instant ? 'none' : 'transform 0.5s ease';
        track.style.transform = `translateX(${target}px)`;
    }

    function handleResize() {
        const newView = getItemsPerView();
        if (newView !== itemsPerView) {
            itemsPerView = newView;
            currentSlide = 0;
            renderCards();
            updateTrackPosition(true);
        }
    }

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        currentSlide++;
        updateTrackPosition();
    });

    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        currentSlide--;
        updateTrackPosition();
    });

    track.addEventListener('transitionend', () => {
        const total = testimonials.length;
        if (!total) return;

        if (currentSlide >= total) {
            currentSlide = 0;
            updateTrackPosition(true);
        }

        if (currentSlide < 0) {
            currentSlide = total - 1;
            updateTrackPosition(true);
        }

        isAnimating = false;
    });

    window.addEventListener('resize', handleResize);
}
