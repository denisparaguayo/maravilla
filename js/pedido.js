//Variables
const ubicacion = document.querySelector('#ubicacion');
let ubiHide = document.querySelector('#ubi-hide');
const nombre = document.querySelector('#nombre');
const telefono = document.querySelector('#telefono');
const cantidad = document.querySelector('#cantidad');
const btnEnviar = document.querySelector('#enviar');
const formulario = document.querySelector('#enviar-pedido');
const er = /^([0-9])*$/;

let tuUbi;

const precio = 8500;

evenListener();
function evenListener() {
	document.addEventListener('DOMContentLoaded', iniciarApp);

	//Campos del Formulario
	nombre.addEventListener('blur', validarFormulario);
	telefono.addEventListener('blur', validarFormulario);

	ubicacion.addEventListener('click', function () {
		//Si el navegador soporta geolocalizacion
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error, options);
		} else {
			alert('No esta Permitido la obtención de Ubicacion');
		}
		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		};
		function success(geolocationPosition) {
			let coords = geolocationPosition.coords;
			let { latitude, longitude, accuracy } = coords;
			ubiHide = `https://www.google.com/maps/@${latitude},${longitude},20z`;
			const mensajeUbi = document.createElement('p');
			mensajeUbi.textContent = `Ubicacion Encontrada Precicion: ${accuracy}, Metros`;
			mensajeUbi.classList.add('alert', 'alert-success', 'text-center');
			formulario.appendChild(mensajeUbi);
			console.log(ubiHide);
			setTimeout(() => {
				mensajeUbi.remove();
			}, 3500);
		}

		function error(err) {
			mostrarError('No esta Permitido la obtención de Ubicacion');
		}
	});

	cantidad.addEventListener('change', sumarTotal);

	function validarFormulario(e) {
		if (e.target.value.length > 0) {
			const error = document.querySelector('p.error');
			if (error) {
				error.remove();
			}
			e.target.classList.remove('border', 'border-warning');
			e.target.classList.add('border', 'border-success');
		} else {
			e.target.classList.remove('border', 'border-success');
			e.target.classList.add('border', 'border-warning');
			mostrarError('Todos los Campos son Obligatorios');
		}

		if (nombre.value !== '' && telefono.value !== '' && cantidad.value !== '') {
			btnEnviar.disabled = false;
		}
	}

	function mostrarError(mensaje) {
		const mensajeError = document.createElement('p');
		mensajeError.textContent = mensaje;
		mensajeError.classList.add('alert', 'alert-danger', 'text-center', 'error');

		const errores = document.querySelectorAll('.error');

		if (errores.length === 0) {
			formulario.appendChild(mensajeError);
		}
	}

	// formulario.addEventListener('submit', enviarEmail);
}

//Funciones
function iniciarApp() {
	btnEnviar.disabled = true;
}

function sumarTotal() {
	console.log(Number(cantidad.value) * precio);
	let total = Number(cantidad.value) * precio;
	let mensajeTotal = document.createElement('p');
	mensajeTotal.textContent = `Total: Gs. ${total}`;
	mensajeTotal.classList.add('alert', 'alert-info', 'text-center', 'total');

	const totaal = document.querySelectorAll('.total');
	if (totaal.length === 0) {
		formulario.appendChild(mensajeTotal);
		setTimeout(() => {
			mensajeTotal.remove();
		}, 3000);
	}
}

// function enviarEmail(e) {
// 	e.preventDefault();
// 	alert('Mensaje enviado');
// 	setTimeout(() => {
// 		window.location.href = 'index.html';
// 	}, 2000);
// }
