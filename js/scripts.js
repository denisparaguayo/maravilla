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

// Lógica para cargar y mostrar productos desde el archivo JSON
document.addEventListener('DOMContentLoaded', function () {
	// Ruta del archivo JSON
	const jsonPath = 'productos.json';

	// Obtener el contenedor de productos
	const productosGrid = document.getElementById('productosGrid');

	// Verificar si el contenedor existe antes de intentar cargar los productos
	if (productosGrid) {
		// Generar dinámicamente los elementos HTML para cada producto
		fetch(jsonPath)
			.then((response) => response.json())
			.then((productos) => {
				productos.forEach((producto) => {
					const productoHTML = `
                        <a href="producto.html?id=${
													producto.id
												}" class="producto-link">
                            <div class="bg-white rounded-lg shadow-md mb-4 sm:p-2 md:p-4">
                                <img src="${producto.imagen}" alt="${
						producto.nombre
					}" class="w-full h-auto object-contain mb-4">
                                <h2 class="text-lg font-bold text-gray-800">${
																	producto.nombre
																}</h2>
                                <p class="text-sm text-gray-600">${
																	producto.categoria
																}</p>
                                <p class="text-lg font-bold text-white mt-2">₲${producto.precio.toLocaleString()}</p>
                            </div>
                        </a>
                    `;
					productosGrid.innerHTML += productoHTML;
				});
			})
			.catch((error) => {
				console.error('Error al cargar el archivo JSON:', error);
			});
	}
});

// Código adicional para manejar la página individual del producto
const productoDetalle = document.getElementById('productoDetalle');
const queryParams = new URLSearchParams(window.location.search);
const productId = queryParams.get('id');

if (productId) {
	// Cargar detalles del producto utilizando productId
	fetch(`productos.json`)
		.then((response) => response.json())
		.then((productos) => {
			const producto = productos.find((p) => p.id === parseInt(productId));
			if (producto) {
				// Calcular el precio con el aumento del 37% para basico
				const precioConDescuento = producto.precio * 1.37;

				const productoHTML = `
				<div class="container mx-auto my-8 px-2">
				<div class="flex flex-col sm:flex-row bg-white p-8 rounded-lg shadow-md">
				  <img src="${producto.imagen}" alt="${
					producto.nombre
				}" class="w-full sm:w-1/2 h-auto object-contain mb-4 sm:mb-0">
				  <div class="sm:ml-8">
					<h2 class="text-3xl font-bold text-gray-800">${producto.nombre}</h2>
					<p class="text-sm text-gray-600">${producto.categoria}</p>
					<p class="text-lg font-bold text-amber-500 mt-2">₲${precioConDescuento.toLocaleString()}</p>
					<p class="text-gray-800">${producto.descripcion}</p>
					<p class="text-gray-600 mt-2">Para compras mayoristas, contáctanos en WhatsApp: <a class="text-green-500 font-bold" href="https://wa.me/595986550235" target="_blank">0986 550-235</a></p>
					<a href="productos.html" class="bg-amber-500 text-white px-4 py-2 mt-4 inline-block">Volver a Productos</a>
				  </div>
				</div>
			  </div>
        `;
				productoDetalle.innerHTML = productoHTML;
			} else {
				console.error('Producto no encontrado');
			}
		})
		.catch((error) => {
			console.error('Error al cargar el archivo JSON:', error);
		});
}
