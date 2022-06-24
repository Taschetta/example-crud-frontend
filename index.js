
// Estado de la aplicacion
// Aca guardas las variables compartidas por todo el script
// Como el listado de usuarios o el usuario seleccionado

const state = {
  selectedId: 0,
  users: []
}

// Getters y Setters
// Se encargan solamente de actualizar el estado

function setSelectedId(selectedId) {
  state.selectedId = parseInt(selectedId)
}

// Acciones de la aplicacion
// Al igual que los getters y setters, se encargan de modificar el estado
// pero tambien pueden tener mas logica aparte de modificar el estado

// Por ejemplo, en una aplicacion real esta funcion se reemplazaría con un fetch
// que traería a los usuarios desde un backend, y tendria toda esa logica aca adentro
function filterUsers() {
  state.users = [
    { id: 1, nombre: 'Roberto', apellido: 'Gomez', email: 'rgomez@mail.com' },
    { id: 2, nombre: 'Aurelia', apellido: 'Armas', email: 'aarmas@mail.com' },
    { id: 3, nombre: 'Priegos', apellido: 'Ruros', email: 'pruros@mail.com' },
  ]
}

// Nodos del DOM
// Acá traemos los nodos del DOM que necesitamos para la aplicacion

const table = document.querySelector('.table')

// Actualizaciones al DOM
// Son funciones que se encargan solamente de moficar el DOM,
// es decir, el HTML y nada mas. Para eso pueden leer los datos
// del estado

// por ejemplo, esta funcion 
// agarra el body de nuestro elemento table
// y por cada usuario agrega una nueva fila a la tabla
function fillTable() {
  const body = table.querySelector('tbody')
  body.innerHTML = state.users.map(user => {
    return `
      <tr>
        <td><input class="radio-selected" type="radio" name="selected" value="${user.id}"></td>
        <td>${user.nombre}</td>
        <td>${user.apellido}</td>
        <td>${user.email}</td>
      </tr>
    `
  }).join('')
}

// Eventos del DOM
// Son las primeras funciones que son llamadas al dispararse 
// un evento, como un click, un submit o algo asi. 
// Se engargan de llamar a las funciones de arriba

function onRadioSelectedChange(selectedId) {
  setSelectedId(selectedId)
}

function onFirstLoad() {
  filterUsers()
  fillTable()
}

// Inicializar eventos
// Es decir, vincular nuestras funciones de eventos
// con los elementos del DOM

document.addEventListener('change', (event) => {
  if(event.target.matches('.radio-selected')) {
    onRadioSelectedChange(event.target.value)
  }
})

onFirstLoad()