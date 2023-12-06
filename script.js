//Variable que se encargará de almacenar los datos datos de la reserva para mostrarlo dentro del DOM al usuario
let mensaje = "";
//Aquí se almacena la información (valor) de los checkbox seleccionados por el usuario
function validarFormulario() {
    //Esta expresión se va a utilizar para validar la información que introduce el usuario en el campo nombre del formulario
    const patronNombre = /^\w\D+(?<!\W+)$/;//Cualquier caracter A-Z a-z y _ con un tamaño mínimo de 8 caracteres. No permite el uso de símbolos tales como @ o ! ni números
    let nombre = document.getElementById('nombre').value
    /*Si el campo nombre está en blanco o la información facilitada por el usuario 
    no coincide con la expresión regular no se valida la información.
    En cualquiera de los casos se mostrará la información del error al usuario*/
    if (!patronNombre.test(nombre)) {
        document.getElementById('info_nombre').textContent = "*El nombre no es valido. Solo puede contener letras mayúsculas, minúsculas y sin carácteres especiales";
        setInterval("location.reload()",4000);
    }

    let actividad=document.getElementById('actividad').value;
    //Solo se admiten actividades incluidas dentro del patrón que hemos definido
    const patronActividades = /(Pilates|Yoga|Spinning|Crossfit|BodyPump|Taekwondo|Muay thai|Krav maga|Boxeo)/;
    if (!patronActividades.test(actividad)){
        document.getElementById('info_actividad').textContent = "*La actividad "+actividad+" no disponible se está disponible de forma temporal";
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
        if (patronNombre.test(nombre)&&patronActividades.test(actividad)&&patronFecha.test(fecha)) {
            let confirmarReserva = window.confirm("Indica si quieres confirmar la reserva");
            //Almacenamos los datos nombre, actividades y fecha facilitados por el usuario en un array
            let datosCookie = [nombre, actividad, fecha];
            //Si el usuario confirma la reserva se crea la cookie y se muestran los datos de reserva
            let nombreCookie="reserva"+nombre;//Variable que almacena el nombre de la cookie. Esta información se utiliza también como identificador del elemento li al que va asociado la cookie
            if (confirmarReserva == true) {
                //Este array junto con el periodo de validez de la cookie serán los datos con los que vamos a crear la cookie
                guardarReservaEnCookie(nombreCookie,datosCookie, 7);
                //Esta función se encarga de leer los datos de la cookie una vez creada y mostrar la información al usuario
                
                document.getElementById('contenedor_reservas').style.visibility = "visible";
                alert("Reserva realizada");
            }

            let infoCookie = leerReservaDeCookie(nombreCookie);//Recuperamos los datos de la cookie desde document.cookie y almacenamos la información en una variable
            console.log(infoCookie);
            //Variable que almacena el nombre de la cookie recuperado desde la cookie. Esta información se utiliza como identificador del elemento li al que va asociado la cookie
            //Se muestra por consola los datos de la cookie
            mensaje += `<li id="${nombreCookie}">`+datosCookie[0]+"-> actividades reservadas: "+datosCookie[1]+", fecha reserva: "+datosCookie[2]+ "</li>";
            
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
                    guardarReservaEnCookie(nombreCookie,"",-1)//Borramos la cookie estableciendo una fecha anterior a la actual
                    alert("Reserva eliminada");
                    setInterval("location.reload()",4000);
                }
            });
        }
    }
}

/*Asociamos la función validarFormulario al botón correspondiente y 
variamos su comportamiento por defecto para evitar que envíe los datos del formulario con preventDefault*/
document.getElementById('enviar').addEventListener("click", function (event) {event.preventDefault(), validarFormulario()});

//Gestión de cookies
//Crea una cookie
function guardarReservaEnCookie(nombreCookie,datosCookie, duracion) {
    var validez = new Date();
    //Establecemos un nuevo valor para el objeto tipo Date validez sumando a la fecha actual la duración que marcamos hasta que caduque la cookie
    validez.setDate(validez.getDate() + duracion);
    document.cookie = encodeURIComponent(nombreCookie)+"=" + encodeURIComponent(datosCookie) + "; expires=" + validez.toUTCString() + "path=/;";
    return document.cookie;
}

function leerReservaDeCookie(nombreCookie){
    let cookies=document.cookie.split(';')
    for (let i=0; i<cookies.length; i++){
        var cookie = cookies[i].trim();
        if(cookie.startsWith (nombreCookie+"=")){
            return cookie.substring(nombreCookie.length+1);
        }
        return null;
    }
}

