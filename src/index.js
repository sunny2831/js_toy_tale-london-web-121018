const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const cardArea = document.querySelector('#toy-collection')
const formEl = toyForm.querySelector('.add-toy-form')
let addToy = false

// YOUR CODE HERE

state = {
  toys: []
}

function addToyCard (toy) {
  const toyCard = document.createElement('div')
  toyCard.className = 'card'
  toyCard.dataset.toyId = toy.id
  toyCard.innerHTML =
    ` <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
    `

  const btn = document.createElement('button')
  btn.className = 'like-btn'
  btn.innerText = 'Like <3'
  btn.dataset["likeBtnId"] = toy.id
  btn.addEventListener('click', (event) => {
    addLike(toy)
      .then(toy => {
        stateToy = state.toys.find(t => t.id == toy.id)
        stateToy.likes += 1
        renderAllToyCards(state.toys)
      })
    // find the toy in the state,
    // increment the number of likes,
    // cause a rerender
  })
  toyCard.append(btn)
  cardArea.append(toyCard)
}

function renderAllToyCards (toys) {
  cardArea.innerHTML = ''
  state.toys.forEach(toy => addToyCard(toy))
}



function getToys () {
  return fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
}

function initialize () {
  listenerForNewToy()
  getToys()
    .then(toys => {
      state.toys = toys
      renderAllToyCards(state.toys)
    })
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

function listenerForNewToy () {
  formEl.addEventListener('submit', function (event) {
    event.preventDefault()
    const toy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }
    newToy(toy)
    .then(toy => {
      addToyCard(toy)
      state.toys.push(toy)
    })
    // addToyCard(toy)
  })
}



function newToy (toy) {
  return fetch(`http://localhost:3000/toys`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
               Accept: 'application/json'},
    body: JSON.stringify(toy)
          }).then(resp => resp.json())
}

function addLike (toy) {
  return fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json',
               Accept: 'application/json'},
    body: JSON.stringify({likes: toy['likes'] + 1})
          }).then(resp => resp.json())
}


// OR HERE!

initialize()
