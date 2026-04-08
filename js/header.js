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

    if ('IntersectionObserver' in window && sections.length > 0) {
        const visibleSections = new Map();

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visibleSections.delete(entry.target.id);
                    }
                });

                const [currentSection] = [...visibleSections.entries()].sort((a, b) => b[1] - a[1]);

                if (currentSection) {
                    setActiveLink(currentSection[0]);
                }
            },
            {
                rootMargin: '-30% 0px -45% 0px',
                threshold: [0.2, 0.45, 0.7]
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
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
