
// Constantes de la aplicacion

// En una aplicacion real, los usuarios estarían en una base de datos
// a la que accederiamos por medio de un backend.
const USERS = [
  { id: 1, name: 'Roberto', surname: 'Gomez', email: 'rgomez@mail.com' },
  { id: 2, name: 'Aurelia', surname: 'Armas', email: 'aarmas@mail.com' },
  { id: 3, name: 'Priegos', surname: 'Ruros', email: 'pruros@mail.com' },
]

// Estado de la aplicacion
// Aca guardas las variables compartidas por todo el script
// Como el listado de usuarios o el usuario seleccionado

const state = {
  search: '',
  selectedId: 0,
  users: []
}

// Getters y Setters
// Se encargan solamente de actualizar el estado (set)
// O devolver datos calculados del estado (get)

// p.ej. al actualizar el dato search, antes lo pone todo en minuscula
function setSearch(search) {
  state.search = search.toLowerCase()
}

function setSelectedId(selectedId) {
  state.selectedId = parseInt(selectedId)
}

function getSelected() {
  return state.users.find(user => user.id === state.selectedId) || {}
}

// Acciones de la aplicacion
// Al igual que los getters y setters, se encargan de modificar el estado
// pero tambien pueden tener mas logica aparte de modificar el estado

// Por ejemplo, en una aplicacion real esta funcion llamaría a un backend 
// con fetch para traer a los usuarios
function filterUsers() {
  const users = USERS
  const search = state.search
  state.users = users.filter(user => {
    return (
      search === '' ||
      user.name.toLowerCase().includes(search) || 
      user.surname.toLowerCase().includes(search) || 
      user.email.toLowerCase().includes(search)
    )
  })
}

function removeUser(id) {
  const index = USERS.findIndex(user => user.id === id)
  USERS.splice(index, 1)
}

function upsertUser(data) {
  if(data.id === 0) {
    data.id = USERS[USERS.length - 1].id + 1
    USERS.push(data)
  } else {
    const index = USERS.findIndex(user => user.id == data.id)
    USERS.splice(index, 1, data)
  }
}

// Nodos del DOM
// Acá traemos los nodos del DOM que necesitamos para la aplicacion


const formSearch = document.querySelector('.search')
const table = document.querySelector('.table')

const buttonInsert = document.querySelector('.button-insert')
const buttonUpdate = document.querySelector('.button-update')
const buttonRemove = document.querySelector('.button-remove')

const form = document.querySelector('.form-user')

const buttonCancel = document.querySelector('.button-cancel')

// Actualizaciones al DOM
// Son funciones que se encargan solamente de moficar el DOM,
// es decir, el HTML y nada mas. Para eso pueden leer los datos
// del estado

// por ejemplo, esta funcion 
// agarra el body de nuestro elemento table
// y por cada usuario agrega una nueva fila a la tabla

function updateTable() {
  const body = table.querySelector('tbody')
  body.innerHTML = state.users.map(user => {
    return `
      <tr>
        <td><input class="radio-selected" type="radio" name="selected" value="${user.id}"></td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td>${user.email}</td>
      </tr>
    `
  }).join('') || '<tr><td class="text-center" colspan="4">Sin datos</td></tr>'
}

function updateActions() {
  if(state.selectedId === 0) {
    buttonInsert.removeAttribute('disabled')
    buttonUpdate.setAttribute('disabled', '')
    buttonRemove.setAttribute('disabled', '')
  } else {
    buttonInsert.removeAttribute('disabled')
    buttonUpdate.removeAttribute('disabled')
    buttonRemove.removeAttribute('disabled')
  }
}

function disableActions() {
  buttonInsert.setAttribute('disabled', '')
  buttonUpdate.setAttribute('disabled', '')
  buttonRemove.setAttribute('disabled', '')
}

function showForm() {
  form.removeAttribute('hidden')
}

function loadForm() {
  const user = getSelected()
  form.elements.name.value = user.name || ''
  form.elements.surname.value = user.surname || ''
  form.elements.email.value = user.email || ''
}

function cleanForm() {
  form.elements.name.value = ''
  form.elements.surname.value = ''
  form.elements.email.value = ''
}

function hideForm() {
  form.setAttribute('hidden', '')
}

function getFormData() {
  const data = {}
  data.name = form.elements.name.value
  data.surname = form.elements.surname.value
  data.email = form.elements.email.value
  return data
}

// Eventos del DOM
// Son las primeras funciones que son llamadas al dispararse 
// un evento, como un click, un submit o algo asi. 
// Se engargan de llamar a las funciones de arriba

function onSearchSubmit(search) {
  setSearch(search)
  setSelectedId(0)
  filterUsers()
  updateTable()
  updateActions()
}

function onRadioSelectedChange(selectedId) {
  setSelectedId(selectedId)
  updateActions()
}

function onButtonInsertClick() {
  disableActions()
  setSelectedId(0)
  loadForm()
  showForm()
}

function onButtonUpdateClick() {
  disableActions()
  loadForm()
  showForm()
}

function onButtonRemoveClick() {
  const selectedId = state.selectedId
  removeUser(selectedId)
  setSelectedId(0)
  filterUsers()
  updateTable()
  updateActions()
}

function onButtonCancelClick() {
  cleanForm()
  hideForm()
  updateActions()
}

function onFormSubmit() {
  const user = getFormData()
  user.id = state.selectedId
  upsertUser(user)
  setSelectedId(0)
  hideForm()
  cleanForm()
  filterUsers()
  updateTable()
  updateActions() 
}

function onFirstLoad() {
  filterUsers()
  updateTable()
  updateActions()
}

// Inicializar eventos
// Es decir, vincular nuestras funciones de eventos
// con los elementos del DOM

formSearch.addEventListener('submit', (event) => {
  event.preventDefault()
  onSearchSubmit(event.target.elements.search.value)
})

document.addEventListener('change', (event) => {
  if(event.target.matches('.radio-selected')) {
    onRadioSelectedChange(event.target.value)
  }
})

buttonInsert.addEventListener('click', (event) => {
  onButtonInsertClick()
})

buttonUpdate.addEventListener('click', (event) => {
  onButtonUpdateClick()
})

buttonRemove.addEventListener('click', (event) => {
  onButtonRemoveClick()
})

buttonCancel.addEventListener('click', (event) => {
  onButtonCancelClick()
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  onFormSubmit()
})

onFirstLoad()