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

document.addEventListener('DOMContentLoaded', function () {
	const jsonPath = 'productos.json';
	const productosPorPagina = 6;
	let productosCargados = 0;
	let categoriaSeleccionada = '';

	// Función para cargar productos
	function cargarProductos() {
		// Obtener el contenedor de productos
		const productosGrid = document.getElementById('productosGrid');

		// Verificar si el contenedor existe antes de intentar cargar los productos
		if (productosGrid) {
			// Realizar la petición al archivo JSON
			fetch(jsonPath)
				.then((response) => response.json())
				.then((productos) => {
					// Filtrar productos por categoría seleccionada
					let productosFiltrados = productos;
					if (categoriaSeleccionada && categoriaSeleccionada !== 'Todos') {
						productosFiltrados = productos.filter(
							(producto) => producto.categoria === categoriaSeleccionada
						);
					}

					// Calcular el índice inicial y final de los productos a cargar
					const inicio = productosCargados;
					const fin = Math.min(
						productosCargados + productosPorPagina,
						productosFiltrados.length
					);

					// Generar HTML de los productos
					for (let i = inicio; i < fin; i++) {
						const producto = productosFiltrados[i];
						// Calcular el precio con el aumento del 40% para básico
						const precioConDescuento = producto.precio * 1.4;
						const porcentajeAumento = 0.45;
						const nuevoPrecio = producto.precio * (1 + porcentajeAumento);
						// Generar HTML de la tarjeta del producto
						const productoHTML = `
                        <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                            <a href="producto.html?id=${producto.id}">
                                <img src="${producto.imagen}" alt="${
							producto.nombre
						}" class="w-full object-cover rounded-t-xl" />
                                <div class="px-4 py-3 w-72 text-left">
                                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold rounded uppercase">${
																			producto.categoria
																		}</span>
                                    <p class="text-lg font-bold text-black block capitalize">${
																			producto.nombre
																		}</p>
                                    <div class="flex items-center">
                                        <p class="text-lg font-semibold text-black cursor-auto my-3">₲${precioConDescuento.toLocaleString()}</p>
                                        <del>
                                            <p class="text-sm text-gray-600 cursor-auto ml-2">₲${nuevoPrecio.toLocaleString()}</p>
                                        </del>
                                        <div class="ml-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>`;
						// Agregar la tarjeta del producto al contenedor
						productosGrid.insertAdjacentHTML('beforeend', productoHTML);
					}

					// Actualizar el contador de productos cargados
					productosCargados += fin - inicio;

					// Ocultar el botón "Ver Más" si se han cargado todos los productos
					if (productosCargados >= productosFiltrados.length) {
						const btnVerMas = document.getElementById('btnVerMas');
						if (btnVerMas) {
							btnVerMas.style.display = 'none';
						}
					}
				})
				.catch((error) => {
					console.error('Error al cargar el archivo JSON:', error);
				});
		}
	}

	// Cargar los primeros productos
	cargarProductos();

	// Obtener y cargar categorías únicas desde el archivo JSON
	fetch(jsonPath)
		.then((response) => response.json())
		.then((productos) => {
			const categorias = [
				'Todos',
				...new Set(productos.map((producto) => producto.categoria)),
			];
			const selectCategoria = document.getElementById('categoria');
			if (selectCategoria) {
				categorias.forEach((categoria) => {
					const option = document.createElement('option');
					option.value = categoria;
					option.text = categoria;
					selectCategoria.appendChild(option);
				});

				// Manejar cambio en el menú desplegable de categorías
				selectCategoria.addEventListener('change', function () {
					productosCargados = 0; // Reiniciar contador de productos cargados
					categoriaSeleccionada = this.value; // Actualizar la categoría seleccionada
					// Limpiar el contenedor de productos antes de cargar los nuevos
					const productosGrid = document.getElementById('productosGrid');
					if (productosGrid) {
						productosGrid.innerHTML = '';
					}
					// Cargar los productos nuevamente con la nueva categoría seleccionada
					cargarProductos();
				});
			}
		})
		.catch((error) => {
			console.error(
				'Error al obtener las categorías desde el archivo JSON:',
				error
			);
		});
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
				const precioConDescuento = producto.precio * 1.4;

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
