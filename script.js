let mensaje = "";
//Aquí se almacena la información (valor) de los checkbox seleccionados por el usuario
let actividades = [];
function validarFormulario() {
    //Esta expresión se va a utilizar para validar la información que introduce el usuario en el campo nombre del formulario
    let miExpresion = /[A-Z a-z \s]{8,}/;
    let nombre = document.getElementById('nombre').value
    /*Si el campo nombre está en blanco o la información facilitada por el usuario 
    no coincide con la expresión regular no se valida la información.
    En cualquiera de los casos se mostrará la información del error al usuario*/
    if (nombre === "" || !miExpresion.test(nombre)) {
        if (nombre === "") {
            document.getElementById('info_nombre').textContent = "*Debes incluir tu nombre";
        }
        if (!miExpresion.test(nombre)) {
            document.getElementById('info_nombre').textContent = "*El nombre no es valido. Solo puede contener letras mayúsculas, minúsculas o espacios y deben ser mínimo 8 carácteres";
        }
    }

    let checkSeleccionados = comprobarCheckbox();
    //En caso de no elegir ninguna actividad se informa al usuario del error
    if (checkSeleccionados == 0) {
        document.getElementById('info_actividad').textContent = "*Debes elegir al menos una actividad";
    }

    //Si la fecha no se ha cumplimentado se muestra mensaje al usuario
    let fecha = document.getElementById('fecha').value
    if (fecha === "") {
        document.getElementById('info_fecha').textContent = "*Debes indicar una fecha";
    }

    //En caso de que el usuario haya facilitado todos los datos requeridos se crea una cookie y se mostraran los datos de la reserva
    else {
        if (nombre != "" && miExpresion.test(nombre) && checkSeleccionados > 0 && fecha != "") {

            //Este bucle recorre todos los elementos tipo checkbox recuperados del formulario y solo devuelve el valor de los elementos marcados
            for (let i = 0; i < elementos.length; i++) {
                if (elementos[i].checked) {
                    //Pasa el valor de elementos[i] al array actividades
                    actividades.push(elementos[i].value);
                    //mensaje += elementos[i].value + ", ";
                }
            }
            let confirmaReserva = window.confirm("Indica si quieres confirmar la reserva");
            //Si el usuario confirma la reserva se crea la cookie y se muestran los datos de reserva 
            if (confirmaReserva == true) {
                //Almacenamos los datos nombre, actividades y fecha facilitados por el usuario en un array
                let datosCookie = [nombre, actividades, fecha];
                //Este array junto con el periodo de validez de la cookie serán los datos con los que vamos a crear la cookie
                guardarReservaEnCookie(datosCookie, 7);
                //Esta función se encarga de leer los datos de la cookie una vez creada y mostrar la información al usuario
                leerReservaDeCookie();
                document.getElementById('contenedor_reservas').style.visibility = "visible";
                alert("Reserva realizada");
            }
        }
    }

}

/*Asociamos la función validarFormulario al botón correspondiente y 
variamos su comportamiento por defecto para evitar que envíe los datos del formulario con preventDefault*/
document.getElementById('enviar').addEventListener("click", function (event) { event.preventDefault(), validarFormulario() });

/*Se recuperan todos los elementos checkbox del formulario.
Otra alternativa sería utilizar document.forms['gimnasio']['actividad']*/
const elementos = document.querySelectorAll('input[type="checkbox"]');
//Función para comprobar los checkbox marcados en el formulario. Devuelve el número de elementos seleccionados
function comprobarCheckbox() {
    let numSeleccionados = 0;
    //Se recorre el array elementos y se contabilizan los checkbox marcados en el formulario
    elementos.forEach((elemento) => {
        if (elemento.checked) {
            numSeleccionados++;
        }
    });
    return numSeleccionados;
}

//Gestión de cookies
//Crea una cookie
function guardarReservaEnCookie(datosCookie, duracion) {
    var validez = new Date();
    //Establecemos un nuevo valor para el objeto tipo Date validez sumando a la fecha actual la duración que marcamos hasta que caduque la cookie
    validez.setDate(validez.getDate() + duracion);
    document.cookie = "datosReserva=" + encodeURIComponent(datosCookie) + "; expires=" + validez + "path=/;";
    return document.cookie;
}

//Lee la información de la cookie y muestra los datos de la reserva
function leerReservaDeCookie() {
    //Variable que almacena la cookie
    let infoCookie = document.cookie;
    //Se muestra por consola los datos de la cookie
    console.log(document.cookie);
    console.log(infoCookie.slice(13, infoCookie.length).split('%2C'));
    /*Con la información recuperada de la cookie y desechando la información que no sirve 
    se crea un array con los datos de la reserva recuperados desde la cookie
    slice establece a partir que elemento de la cadena nos sirve la información 
    (desechamos los 13 primeros elementos de la cadena)
    %2C establece a partir que elemento dividimos la cadena para crear el array*/
    let datosReserva = infoCookie.slice(13, infoCookie.length).split('%2C');
    mensaje += '<li onclick="eliminarElemento(this)">Nombre: ' + datosReserva[0].replace(/%20/g," ") + " ";
    mensaje += "Actividades reservadas: ";
    /*Obtenemos los elementos desde la posición 1 hasta la posición final -1
    El elemento de la posición final corresponde a la fecha que hemos recuperado desde la cookie
    y el elemento de la posición inicial o 0 corresponde al nombre*/
    for (let i = 1; i < datosReserva.length - 1; i++) {
        //Formateo la información para presentarla al usuario utilizando expresiones regulares
        mensaje += datosReserva[i].replace(/%20/g, " ") + " ";
    }
    mensaje += "Fecha: " + datosReserva[datosReserva.length - 1] + "</li>";
    /*Toda la información recuperada desde la cookie y formateada convenientemente
    se almacena en la variable mensaje que es la información que mostramos al usuario
    con los datos de su reserva*/
    document.getElementById('lista_reservas').innerHTML = mensaje;
}


function eliminarElemento(elemento) {
    document.getElementById('lista_reservas').removeChild(elemento);
}
