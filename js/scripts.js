document.addEventListener('DOMContentLoaded', function () {
	// Función para mostrar/ocultar el menú desplegable en dispositivos móviles
	document.getElementById('menu-toggle').addEventListener('click', function () {
		document.getElementById('mobile-menu').classList.toggle('hidden');
	});
});

// slider------>
const swiper = new Swiper('.swiper-hero', {
	// Parámetros opcionales
	direction: 'horizontal',
	loop: true,
	autoplay: {
		delay: 5000,
		pauseOnMouseEnter: true,
		disableOnInteraction: false,
	},

	//If we need pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// And if we need scrollbar
	// scrollbar: {
	// 	el: '.swiper-scrollbar',
	// },
});
// slider--------->
