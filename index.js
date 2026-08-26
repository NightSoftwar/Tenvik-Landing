const menuToggle = document.querySelector('.site-header__toggle');
const headerNav = document.querySelector('.site-header__nav');

const closeMobileMenu = () => {
	headerNav.classList.remove('is-open');
	document.body.classList.remove('menu-open');
	menuToggle.setAttribute('aria-expanded', 'false');
	menuToggle.setAttribute('aria-label', 'Abrir menú');
};

closeMobileMenu();

menuToggle.addEventListener('click', () => {
	const isOpen = headerNav.classList.toggle('is-open');
	document.body.classList.toggle('menu-open', isOpen);
	menuToggle.setAttribute('aria-expanded', isOpen);
	menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

headerNav.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => {
		closeMobileMenu();
	});
});

window.addEventListener('resize', () => {
	if (window.innerWidth > 760) {
		closeMobileMenu();
	}
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener('click', (event) => {
		const targetId = link.getAttribute('href');

		if (!targetId || targetId === '#') {
			return;
		}

		const target = document.querySelector(targetId);

		if (!target) {
			return;
		}

		event.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		history.pushState(null, '', link.getAttribute('href'));

		if (link.classList.contains('site-header__link')) {
			setActiveSection(target.id);
		}
	});
});

const sectionLinks = [...document.querySelectorAll('.site-header__link[href^="#"]')]
	.filter((link) => link.getAttribute('href') !== '#');
const sections = sectionLinks
	.map((link) => document.querySelector(link.getAttribute('href')))
	.filter(Boolean);

const setActiveSection = (sectionId) => {
	sectionLinks.forEach((link) => {
		const isActive = link.getAttribute('href') === `#${sectionId}`;
		link.classList.toggle('is-active', isActive);

		if (isActive) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	});
};

if (sections.length) {
	const initialSection = sections.find((section) => `#${section.id}` === window.location.hash);
	const updateActiveSection = () => {
		const headerOffset = document.querySelector('.site-header').offsetHeight + (window.innerHeight * 0.3);
		const activeSection = sections
			.filter((section) => section.getBoundingClientRect().top <= headerOffset)
			.pop();

		setActiveSection((activeSection || initialSection || sections[0]).id);
	};

	updateActiveSection();
	window.addEventListener('scroll', updateActiveSection, { passive: true });
	window.addEventListener('resize', updateActiveSection);
}
