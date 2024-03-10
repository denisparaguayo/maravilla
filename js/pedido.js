// Variables globales
let productosLista = [];
let copiaInicialLista = [];
let tipoPrecioActual = 'normal'; // Por defecto, el tipo de precio es normal (37%)

// Lógica para cargar productos desde el JSON
async function cargarProductos() {
	try {
		// Realizar solicitud HTTP para obtener el contenido de productos.json
		const response = await fetch('productos.json');
		const productosJSON = await response.json();

		// Obtener el select
		const selectProductos = document.getElementById('producto');

		// Llenar el select con las opciones de productos
		productosJSON.forEach((producto) => {
			const option = document.createElement('option');
			option.value = producto.nombre;
			option.text = producto.nombre;
			option.dataset.precio = producto.precio; // Agregamos el precio como atributo de datos
			selectProductos.appendChild(option);
		});

		// Al cargar los productos, también generamos la copia inicial de la lista
		copiaInicialLista = productosJSON.map((producto) => ({
			...producto,
			cantidad: 0,
			total: 0,
		}));
	} catch (error) {
		console.error('Error al cargar productos:', error);
	}
}

// Lógica para agregar productos dinámicamente y calcular el total del pedido
function agregarProducto() {
	const productoSeleccionado = document.getElementById('producto');
	const cantidad = parseInt(document.getElementById('cantidad').value);
	const tipoPrecio = document.getElementById('tipoPrecio').value;

	const productoEncontrado = copiaInicialLista.find(
		(item) => item.nombre === productoSeleccionado.value
	);

	if (productoEncontrado) {
		// Actualizar cantidad
		productoEncontrado.cantidad += cantidad;
		productoEncontrado.total =
			calcularPrecioFinal(productoEncontrado.precio, tipoPrecio) *
			productoEncontrado.cantidad;
	} else {
		// Agregar nuevo producto
		const nuevoProducto = {
			nombre: productoSeleccionado.value,
			cantidad: cantidad,
			precio: parseFloat(
				productoSeleccionado.options[productoSeleccionado.selectedIndex].dataset
					.precio
			),
			total:
				calcularPrecioFinal(
					parseFloat(
						productoSeleccionado.options[productoSeleccionado.selectedIndex]
							.dataset.precio
					),
					tipoPrecio
				) * cantidad,
		};
		copiaInicialLista.push(nuevoProducto);
	}

	actualizarListaPreliminar();
	calcularMontoTotal();
}

function calcularPrecioFinal(precioBase, tipoPrecio) {
	// Calcular el precio final según el tipo de precio
	switch (tipoPrecio) {
		case 'normal':
			return precioBase * 1.37; // Aumento del 37%
		case 'mayorista':
			return precioBase * 1.3; // Aumento del 30%
		case 'superM':
			return precioBase * 1.25; // Aumento del 25%
		default:
			return precioBase; // Por defecto, devolver el precio base
	}
}

function calcularMontoTotal() {
	const montoTotal = copiaInicialLista.reduce(
		(total, item) => total + item.total,
		0
	);

	// Formatear el montoTotal con separadores de miles y dos decimales
	const montoFormateado = montoTotal.toLocaleString('es-PY', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	document.getElementById('montoTotal').innerText = `Gs. ${montoFormateado}`;
}

// Función para calcular el precio por unidad según el tipo de precio actual
function calcularPrecioPorUnidad(producto) {
	const precioCosto = parseFloat(
		document.getElementById('producto').options[
			document.getElementById('producto').selectedIndex
		].dataset.precio
	);
	let factorPrecio = 1.0; // Por defecto, precio normal

	switch (tipoPrecioActual) {
		case 'mayorista':
			factorPrecio = 1.3; // 30% de recargo
			break;
		case 'super':
			factorPrecio = 1.25; // 25% de recargo
			break;
		// 'normal' ya es el caso por defecto
	}

	return precioCosto * factorPrecio;
}

function actualizarListaPreliminar() {
	const listaProductosElement = document.getElementById('listaProductos');
	listaProductosElement.innerHTML = '';

	copiaInicialLista.forEach((item) => {
		if (item.cantidad > 0) {
			const nuevoProductoElement = document.createElement('div');
			nuevoProductoElement.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <p class="w-2/3">${item.nombre} x ${item.cantidad}</p>
                    <p class="w-1/3 text-right">Gs. ${item.total.toFixed(0)}</p>
                    <button class="text-white bg-red-500 font-bold px-2 py-1" onclick="eliminarProducto('${
											item.nombre
										}')">X</button>
                </div>
            `;
			listaProductosElement.appendChild(nuevoProductoElement);
		}
	});
}

// Función para eliminar un producto de la lista
function eliminarProducto(nombreProducto) {
	// Actualizar la copia inicial de la lista
	copiaInicialLista.forEach((item) => {
		if (item.nombre === nombreProducto) {
			item.cantidad = 0;
			item.total = 0;
		}
	});

	// Calcular y actualizar el total del pedido
	const montoTotal = copiaInicialLista.reduce(
		(total, item) => total + item.total,
		0
	);

	document.getElementById('montoTotal').innerText = `Gs. ${montoTotal.toFixed(
		0
	)}`;

	// Actualizar la lista preliminar de productos
	actualizarListaPreliminar();
}

// Llamar a la función para cargar productos al cargar la página
cargarProductos();

function resetearPedido() {
	// Restaurar la copia inicial de la lista y tipo de precio
	copiaInicialLista = copiaInicialLista.map((item) => ({
		...item,
		cantidad: 0,
		total: 0,
	}));
	tipoPrecioActual = 'normal';

	// Actualizar la lista preliminar y el monto total
	actualizarListaPreliminar();
	calcularMontoTotal();
}
// Función para mostrar el resumen del pedido y confirmar la acción
function mostrarResumenYConfirmar() {
	const nombreCliente = document.getElementById('nombreCliente').value;
	const fechaEntrega = document.getElementById('fechaEntrega').value;

	// Crear el resumen del pedido
	let resumenPedido = `Resumen del Pedido\n\n`;
	resumenPedido += `Cliente: ${nombreCliente}\n`;
	resumenPedido += `Fecha de Entrega: ${fechaEntrega}\n\n`;

	// Agregar detalles de productos desde la lista preliminar
	copiaInicialLista.forEach((item) => {
		if (item.cantidad > 0) {
			resumenPedido += `${item.nombre} x ${
				item.cantidad
			} - Gs. ${item.total.toFixed(0)}\n`;
		}
	});

	// Agregar el total del pedido desde la lista preliminar
	resumenPedido += `Total: Gs. ${
		document.getElementById('montoTotal').innerText
	}`;

	// Función para enviar el pedido por WhatsApp
	function enviarPedido() {
		// Crear el mensaje de WhatsApp
		let mensajeWhatsApp = `Cliente: ${nombreCliente}. \nMi pedido es:\n\n`;
		copiaInicialLista.forEach((item) => {
			if (item.cantidad > 0) {
				mensajeWhatsApp += `${item.nombre} x ${
					item.cantidad
				} - Gs. ${item.total.toFixed(0)}\n`;
			}
		});
		mensajeWhatsApp += `*Total:* Gs. ${
			document.getElementById('montoTotal').innerText
		}\n*Fecha de entrega: ${fechaEntrega}*`;

		// Abre una nueva ventana para enviar el mensaje de WhatsApp
		window.open(
			`https://wa.me/595986550235?text=${encodeURIComponent(mensajeWhatsApp)}`,
			'_blank'
		);
	}

	// Mostrar el resumen en una alerta
	const confirmacion = window.confirm(resumenPedido);

	// Si el usuario confirma, realizar la acción
	if (confirmacion) {
		// Mostrar el pedido en la consola como cadena de texto JSON
		console.log('Pedido generado:', JSON.stringify(copiaInicialLista));

		// Enviar el pedido por WhatsApp
		enviarPedido();

		// Reiniciar el formulario o realizar otras acciones si es necesario
		resetearFormulario();
	}
}

// Asociar la función mostrarResumenYConfirmar al botón Generar Pedido
document
	.getElementById('btnGenerarPedido')
	.addEventListener('click', mostrarResumenYConfirmar);
