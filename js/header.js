'use strict';

const menuIcon = document.querySelector('.menu__icon');
const navbar = document.querySelector('.navbar');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.navbar__link')];
const desktopBreakpoint = window.matchMedia('(min-width: 769px)');

if (!menuIcon || !navbar || navLinks.length === 0) {
    console.warn('Encabezado no inicializado: faltan elementos clave en el DOM.');
} else {
    const closeMenu = () => {
        navbar.classList.remove('isActive');
        menuIcon.setAttribute('aria-expanded', 'false');
    };

    function setActiveLink(id) {
        navLinks.forEach((link) => {
            link.classList.toggle('isActive', link.getAttribute('href') === `#${id}`);
        });
    }

    if (sections.length > 0) {
        let ticking = false;

        const updateActiveSection = () => {
            const headerHeight = document.querySelector('.header')?.offsetHeight ?? 0;
            const activationLine = window.scrollY + headerHeight + window.innerHeight * 0.32;

            let currentSectionId = sections[0].id;

            sections.forEach((section) => {
                if (section.offsetTop <= activationLine) {
                    currentSectionId = section.id;
                }
            });

            setActiveLink(currentSectionId);
            ticking = false;
        };

        const requestSectionUpdate = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateActiveSection);
        };

        updateActiveSection();
        window.addEventListener('scroll', requestSectionUpdate, { passive: true });
        window.addEventListener('resize', requestSectionUpdate);
        window.addEventListener('load', requestSectionUpdate, { once: true });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href')?.replace('#', '');
            if (targetId) {
                setActiveLink(targetId);
            }

            closeMenu();
        });
    });

    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('isActive');
        menuIcon.setAttribute('aria-expanded', navbar.classList.contains('isActive') ? 'true' : 'false');
    });

    desktopBreakpoint.addEventListener('change', (event) => {
        if (event.matches) {
            closeMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!navbar.classList.contains('isActive')) return;

        if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
            closeMenu();
        }
    });
}
