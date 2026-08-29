const menuToggle = document.querySelector('.site-header__toggle');
const headerNav = document.querySelector('.site-header__nav');
const imageTriggers = document.querySelectorAll('.hero__image-trigger, .module__image-trigger');

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

const revealElements = document.querySelectorAll('.features__heading, .features__card, .modules__heading, .module, .faq__heading, .faq__item');

if ('IntersectionObserver' in window && revealElements.length) {
	document.body.classList.add('reveal-ready');

	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

	revealElements.forEach((element) => {
		revealObserver.observe(element);
	});
}

const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach((item) => {
	const button = item.querySelector('.faq__question');
	const answer = item.querySelector('.faq__answer');

	if (!button || !answer) {
		return;
	}

	const setOpenState = (open) => {
		item.classList.toggle('is-open', open);
		button.setAttribute('aria-expanded', String(open));
	};

	setOpenState(false);

	button.addEventListener('click', () => {
		const shouldOpen = !item.classList.contains('is-open');

		faqItems.forEach((faqItem) => {
			const faqButton = faqItem.querySelector('.faq__question');
			const isCurrent = faqItem === item;
			faqItem.classList.toggle('is-open', isCurrent && shouldOpen);
			if (faqButton) {
				faqButton.setAttribute('aria-expanded', String(isCurrent && shouldOpen));
			}
		});
	});
});

const contactForm = document.getElementById('contactForm');

if (contactForm) {
	const submitButton = contactForm.querySelector('button[type="submit"]');
	const honeypot = contactForm.querySelector('.contact__honeypot');
	let lastSubmitTime = 0;

	contactForm.addEventListener('submit', (event) => {
		event.preventDefault();

		if (honeypot && honeypot.value.trim() !== '') {
			return;
		}

		const now = Date.now();
		if (now - lastSubmitTime < 3000) {
			return;
		}

		if (contactForm.dataset.processing === 'true') {
			return;
		}

		contactForm.dataset.processing = 'true';
		lastSubmitTime = now;
		submitButton.disabled = true;
		submitButton.textContent = 'Enviando...';

		const nombre = document.getElementById('clienteNombre').value.trim().toUpperCase();
		const negocio = document.getElementById('negocioNombre').value.trim().toUpperCase();
		const tipoNegocio = document.getElementById('tipoNegocio').value.trim().toUpperCase();
		const whatsappNumber = '584225001368';
		const hora = new Date().getHours();
		let saludo = 'Buenas';

		if (hora >= 5 && hora < 12) {
			saludo = 'Buenos días';
		} else if (hora >= 12 && hora < 18) {
			saludo = 'Buenas tardes';
		} else {
			saludo = 'Buenas noches';
		}

		const mensaje = `*${saludo}*,\n\nVengo del sitio web de Tenvik y quiero solicitar una demo.\n\n*Datos del cliente:*\n- Nombre: *${nombre}*\n- Nombre del negocio: *${negocio}*\n- Tipo de negocio: *${tipoNegocio}*`;
		const encodedMessage = encodeURIComponent(mensaje);
		const mobileUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
		const webUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if (isMobile) {
			window.open(mobileUrl, '_blank');
		} else {
			window.open(webUrl, '_blank');
		}

		setTimeout(() => {
			contactForm.dataset.processing = 'false';
			submitButton.disabled = false;
			submitButton.textContent = 'Solicitar Demo por WhatsApp';
			contactForm.reset();
		}, 3500);
	});
}

if (imageTriggers.length) {
	const lightbox = document.createElement('div');
	const lightboxImage = document.createElement('img');

	lightbox.className = 'image-lightbox';
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', 'Imagen principal ampliada');
	lightboxImage.className = 'image-lightbox__image';
	lightbox.append(lightboxImage);
	document.body.append(lightbox);

	const closeLightbox = () => {
		lightbox.classList.remove('is-open');
		document.body.classList.remove('menu-open');
	};

	imageTriggers.forEach((imageTrigger) => {
		imageTrigger.addEventListener('click', () => {
			const image = imageTrigger.querySelector('img');
			lightboxImage.src = image.src;
			lightboxImage.alt = image.alt;
		lightbox.classList.add('is-open');
		document.body.classList.add('menu-open');
		});
	});
	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeLightbox();
		}
	});
}