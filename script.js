//Variable que se encargará de almacenar los datos datos de la reserva para mostrarlo dentro del DOM al usuarioP
let mensaje = "";
//Aquí se almacena la información (valor) de los checkbox seleccionados por el usuario
let actividades=[];
function validarFormulario() {
    //Esta expresión se va a utilizar para validar la información que introduce el usuario en el campo nombre del formulario
    let patronNombre = /^\w\D{8,}(?<!\W)$/;//Cualquier caracter A-Z a-z y _ con un tamaño mínimo de 8 caracteres. No permite el uso de símbolos tales como @ o ! ni números
    let nombre = document.getElementById('nombre').value
    /*Si el campo nombre está en blanco o la información facilitada por el usuario 
    no coincide con la expresión regular no se valida la información.
    En cualquiera de los casos se mostrará la información del error al usuario*/
    if (!patronNombre.test(nombre)) {
        document.getElementById('info_nombre').textContent = "*El nombre no es valido. Solo puede contener letras mayúsculas y minúsculas, sin espacios y sin carácteres especiales con una longitud mínima de 8 caracteres";
        setInterval("location.reload()",4000);
    }

    let checkSeleccionados = comprobarCheckbox();
    //En caso de no elegir ninguna actividad se informa al usuario del error
    if (checkSeleccionados == 0) {
        document.getElementById('info_actividad').textContent = "*Debes elegir al menos una actividad";
        setInterval("location.reload()",4000);
    }
    //Se muestra mensaje al usuario si el número de actividades seleccionadas es mayor de 2
    if(checkSeleccionados>2){
        document.getElementById('info_actividad').textContent = "*Solo es posible elegir un máximo de 2 actividades"
        setInterval("location.reload()",4000);
    }

    //Si la fecha no se ha cumplimentado se muestra mensaje al usuario
    let fecha = document.getElementById('fecha').value
    const patronFecha=/^\d{4}-\d{2}-\d{2}$/;//Formato fecha(AAAA/MM/DD);
    if (!patronFecha.test(fecha)) {
       document.getElementById('info_fecha').textContent = "*Formato fecha invalido";
       setInterval("location.reload()",4000);
    }

    else {
         /*En caso de que el usuario haya facilitado todos los datos requeridos y los elementos del formulario cumplan requisitos
         se crea una cookie y se mostraran los datos de la reserva*/
        comprobarActividades();
        if (patronNombre.test(nombre)&&actividades.length > 0&&actividades.length<=2&&patronFecha.test(fecha)) {
            let confirmarReserva = window.confirm("Indica si quieres confirmar la reserva");
            //Si el usuario confirma la reserva se crea la cookie y se muestran los datos de reserva 
            if (confirmarReserva == true) {
                //Almacenamos los datos nombre, actividades y fecha facilitados por el usuario en un array
                let datosCookie = [nombre, actividades, fecha];
                //Este array junto con el periodo de validez de la cookie serán los datos con los que vamos a crear la cookie
                guardarReservaEnCookie(nombre,datosCookie, 7);
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
document.getElementById('enviar').addEventListener("click", function (event) {event.preventDefault(), validarFormulario()});

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

//Genera el array de actividades
function comprobarActividades() {
    //Este bucle recorre todos los elementos tipo checkbox recuperados del formulario y solo devuelve el valor de los elementos marcados
    for (let i = 0; i < elementos.length; i++) {
        //Solo se añaden al array las actividades permitidas de acuerdo a un patron
        const patronActividades = /(Pilates|Yoga|Spinning|Crossfit|BodyPump|Taekwondo|Muay thai|Krav maga|Boxeo|MMA)/;
        if (elementos[i].checked) {
            if (patronActividades.test(elementos[i].value)) {
                //Pasa el valor de elementos[i] al array actividades
                actividades.push(elementos[i].value);  
            }
            else {
                //En caso de que la actividad no sea seleccionable se informa al usuario
                document.getElementById('info_actividad').innerHTML += "*La actividad " + elementos[i].value + " no está disponible en este momento<br>";
            }
        }
   }
   return actividades;  
}
    
//Gestión de cookies
//Crea una cookie
function guardarReservaEnCookie(nombre,datosCookie, duracion) {
    var validez = new Date();
    //Establecemos un nuevo valor para el objeto tipo Date validez sumando a la fecha actual la duración que marcamos hasta que caduque la cookie
    validez.setDate(validez.getDate() + duracion);
    document.cookie = encodeURIComponent("reserva"+nombre)+"=" + encodeURIComponent(datosCookie) + "; expires=" + validez.toUTCString() + "path=/;";
    return document.cookie;
}

//Lee la información de la cookie y muestra los datos de la reserva recuperados desde la misma al usuario
function leerReservaDeCookie() {
    //Variable que almacena la cookie
    let infoCookie = document.cookie;
    /*Con la información recuperada de la cookie y desechando la información que no sirve 
    se crea un array con los datos de la reserva recuperados desde la cookie.
    Lo que hacemos mediante la función substring es obtener un array con la información que aparece despues del signo = en la cookie
    infoCookie.indexOf("=")+1 devuelve la posición a partir de la que tenemos que generar la nueva cadena con substring. Como los elementos
    aparecen seperados por el elemento , establecemos que este sea el elemento para dividir la cadena y crear el array datosReserva*/
    let datosReserva = decodeURIComponent(infoCookie.substring(infoCookie.indexOf("=")+1, infoCookie.length)).split(',');
    //Variable que almacena el nombre de la cookie recuperado desde la cookie. Esta información se utiliza como identificador del elemento li al que va asociado la cookie
    let nombreCookie=infoCookie.substring(0,infoCookie.indexOf("="));
    //Se muestra por consola los datos de la cookie
    console.log(document.cookie);
    console.log(datosReserva);
    console.log("Nombre cookie= "+nombreCookie);
    mensaje += `<li id="${nombreCookie}">`+ datosReserva[0]+ ": ";
    /*Obtenemos los elementos desde la posición 1 hasta la posición final-1
    El elemento de la posición final corresponde a la fecha que hemos recuperado desde la cookie
    y el elemento de la posición inicial o 0 corresponde al nombre*/
    for (let i = 1; i < datosReserva.length - 1; i++) {
        mensaje += datosReserva[i]+ " ";
    }
    mensaje += "Fecha: " + datosReserva[datosReserva.length - 1] + "</li>";
    
    /*Toda la información recuperada desde la cookie y formateada convenientemente
    se almacena en la variable mensaje que es la información que mostramos al usuario
    con los datos de su reserva*/
    document.getElementById('lista_reservas').innerHTML = mensaje;

    /*Cada elemento li tiene un identificador que es el nombre de la cookie de donde se recupera la información
    al pulsar sobre cada elemento eliminamos la información que se muestra en pantalla y la cookie
    correspondiente asociada*/
    document.getElementById(nombreCookie).addEventListener("click",function eliminarReserva(){
        let eliminarReserva=window.confirm("Confirma si quieres eliminar está reserva");
        if (eliminarReserva==true){
            document.getElementById('lista_reservas').removeChild(this);
            document.cookie=encodeURIComponent(nombreCookie)+"=; expires=Tue, 1 Jan 2010 03:14:07 GMT; path=/;";
            alert("Reserva eliminada");
            setInterval("location.reload()",4000);
        }
        
    })
}
