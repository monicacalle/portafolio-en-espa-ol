'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let observer;
let initialized = false;

function revealImmediately(element) {
    element.classList.add('is-visible');
}

function bindReveal(element) {
    if (element.dataset.motionBound === 'true') return;
    element.dataset.motionBound = 'true';

    if (prefersReducedMotion.matches) {
        revealImmediately(element);
        return;
    }

    observer.observe(element);
}

function applyMotionTargets(root = document) {
    const rules = [
        { selector: '.header', type: 'fade-down' },
        { selector: '.home__hero-image', type: 'zoom-soft' },
        { selector: '.about__title, .skills__title, .curriculum__title, .projects__title, .reviews__title, .contact__title', type: 'fade-up' },
        { selector: '.about__img-container', type: 'fade-right' },
        { selector: '.about__content, .contact__intro, .contact__form, .footer__wrapper', type: 'fade-left' },
        { selector: '.skills__card, .curriculum__item, .project-card, .carousel__card-inner, .footer__social-link', type: 'fade-up', stagger: 90 },
        { selector: '.projects__category, .reviews__container', type: 'fade-up' }
    ];

    rules.forEach(({ selector, type, stagger = 0 }) => {
        const elements = root.querySelectorAll(selector);

        elements.forEach((element, index) => {
            if (!element.dataset.animate) {
                element.dataset.animate = type;
            }

            if (stagger > 0 && !element.style.getPropertyValue('--enter-delay')) {
                element.style.setProperty('--enter-delay', `${index * stagger}ms`);
            }

            bindReveal(element);
        });
    });
}

function startFloatingAccents() {
    document.querySelectorAll('.about__img').forEach((element) => {
        element.classList.add('is-floating');
    });
}

function initMotionSystem() {
    if (!observer) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -8% 0px'
            }
        );
    }

    applyMotionTargets(document);
    startFloatingAccents();
}

function initializeSiteAnimations() {
    if (initialized) {
        applyMotionTargets(document);
        startFloatingAccents();
        return;
    }

    initialized = true;
    initMotionSystem();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSiteAnimations, { once: true });
} else {
    initializeSiteAnimations();
}

prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('[data-animate]').forEach(revealImmediately);
    }
});
