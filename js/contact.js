'use strict';

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (!contactForm) {
    console.warn('Formulario de contacto no inicializado: no se encontro el formulario.');
} else {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const firstName = (formData.get('first-name') || '').toString().trim();
        const lastName = (formData.get('last-name') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const phone = (formData.get('telefono') || '').toString().trim();
        const message = (formData.get('message') || '').toString().trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ');

        const subject = `Nuevo mensaje desde el portafolio - ${fullName || 'Contacto web'}`;
        const body = [
            'Hola Monica,',
            '',
            'Te escribo desde el formulario de tu portafolio.',
            '',
            `Nombre: ${fullName || '-'}`,
            `Correo: ${email || '-'}`,
            `Telefono: ${phone || '-'}`,
            '',
            'Mensaje:',
            message || '-'
        ].join('\n');

        const mailtoUrl = `mailto:monicacalle369@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        if (contactStatus) {
            contactStatus.textContent = 'Se abrira tu correo para enviar el mensaje.';
        }

        window.location.href = mailtoUrl;
    });
}
