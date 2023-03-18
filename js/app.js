//vARIABLES GLOBALES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');





// EVENTOS

eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto)

}


// CLASES
class Presupuesto {
    
    constructor(presupuesto){ 
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
        this.calcularRestante(); // se llama cada que se agrega un nuevo gasto
    }

    //Calcular restantes
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0); // itera sobre el arreglo y da un total
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );

        //Se llama la funcion de calcular restante para que se actualice el precio
        this.calcularRestante();
    }

}


// user interface (interface de usuario)
class UI {
    insertarPresupuesto(cantidad) {
        //Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        // agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    
    }
    imprimirAlerta(mensaje, tipo){  // se pasa tipo porque son dos alertas dif, una de error y la ootra de exito.
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert'); 

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger') // alert-danger es una clase de bustrap 
        } else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario); // en el query(la etiqueta donde se va a insertar).insertBefore toma dos argumentos, (lo que se inserta, donde se inserta)

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos){ //agregarGastoListado

        this.limpiarHTML(); // Elimina el HTML previo

            gastos.forEach(gasto =>{
                
                const {cantidad, nombre, id} = gasto;

                //Crear un li
                const nuevoGasto = document.createElement('li');
                nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
                nuevoGasto.setAttribute('data-id', id);   //  hace los mismo que el seiguiente. esta el la vieja escuela de js
                nuevoGasto.dataset.id = id;

        

                //Agregar el HTML del gasto.  (Se puede hacer como la forma anterior es mas segura. pero se relizara con HTML)
                nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span> `;

                //Boton para borrar el gasto
                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
                btnBorrar.innerHTML = 'Borrar &times'; // se puede hacer con text conten o con la entidad per inerHTML como se muestra
                btnBorrar.onclick = () =>{  // Darle la funcionalidad al boton de eliminar. Con eliminarGasto(id) llama a toda la funcion.
                    eliminarGasto(id);
                }
                nuevoGasto.appendChild(btnBorrar); // se le agrega a gasto el boton



                // Agregar al HTML
                gastoListado.appendChild(nuevoGasto);

            });
    }

             limpiarHTML(){
                while(gastoListado.firstChild){  //mientras gasto listado tenga algo
                gastoListado.removeChild(gastoListado.firstChild);
                }
             }

             actualizarRestante(restante){
                document.querySelector('#restante').textContent = restante;
             }

             comprobarPresupuesto(presupuestObj){
                const {presupuesto, restante} = presupuestObj;

                const restanteDiv = document.querySelector('.restante'); // se selecciona la etiqueta de la parte que se cambiara de color.

                // Comprobar 25%
                if((presupuesto / 4) > restante){
                    restanteDiv.classList.remove('alert-seccess', 'alert-warning'); // se quita la etiqueta que le da el color azul. Se pone el de alert warning para que lo quite en caso de encontrase.
                    restanteDiv.classList.add('alert-danger'); // se le agrega la etiqueta roja.
                } else if ((presupuesto / 2) > restante){
                    restanteDiv.classList.remove('alert-seccess');
                    restanteDiv.classList.add('alert-warning');
                } else{
                    restanteDiv.classList.remove('alert-danger', 'alert-warning');
                    restanteDiv.classList.add('alert-success');
                }

                //Si el total es 0 o menor
                if(restante <= 0){
                    ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

                    //Para prevenir que se sigan agregando cosas despues de agotarse el presupuesto se desactiva el botton
                    formulario.querySelector('button[type="submit"]').disabled = true;
                }

             }

}

//instanciar
const ui = new UI();

let presupuesto; // se crea la variable aqui para que no quede dentro de la funcion preguntarPresu...



// FUNCIONES

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
    // console.log(presupuestoUsuario);

    // en caso de que el usuario no escriba nada y de aceptar o cancelar tiene que volver a preguntar para que no se valide. si cancela es null y si da aceptar es sring vacio ''
    // para el caso de ser letra y no numero se coloca Number en consola al presupuesto y se condiciona tambien en el if con el isNaN (arroja no es un numero cuando se escribe letra). 
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload(); // en caso de no cumplir se reinica, es decir vuelve a preguntar
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);


    ui.insertarPresupuesto(presupuesto);
}


// Añade gastos
function agregarGasto(e){  // por ser un sibmit se pone e
    e.preventDefault();



    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);



    //Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta( 'Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // GENERAR UN OBJETO DE TIPO GASTO
    const gasto = { nombre, cantidad, id: Date.now() }; // Es lo contrario a destructuring. Es conocido como mejoria del objeto literal. Esto es un objeto wn una sola linea
    
    // Añade un nuevo gasto
    presupuesto.nuevoGasto( gasto );
    
    // Mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos
    const {gastos, restante} = presupuesto; //para que no se pase todo el objeto se le aplica distructuring
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    
    //Reinicia el formulario
    formulario.reset();

}
 
function eliminarGasto(id){
    //ELimina los gastos de la clase
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML 
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos); // una vez que se eliminen los gastos seleccionados se debera de actualizar llamando esta funcion. 
    // se llaman estos dos para que se actualica el precio una vez que se elimina un elemento
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}