const menuToggle = document.querySelector('.menu_toggle');
const headerNav = document.querySelector('.header_nav');

menuToggle.addEventListener('click', () => {
	const isOpen = headerNav.classList.toggle('is-open');
	menuToggle.setAttribute('aria-expanded', isOpen);
	menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

headerNav.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => {
		headerNav.classList.remove('is-open');
		menuToggle.setAttribute('aria-expanded', 'false');
		menuToggle.setAttribute('aria-label', 'Abrir menú');
	});
});
