let addToy = false;
const toyContainer = document.querySelector('#toy-collection');
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");

addBtn.addEventListener("click", newToyToggle);
toyFormContainer.addEventListener('submit', handleSubmit);
toyContainer.addEventListener('click', handleLike);

function newToyToggle(){ // add toy display pop up toggle
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
}

function handleSubmit(event){
  const toyName = event.target[0].value; // get name from input
  const toyImage = event.target[1].value; // get image url from input
  const config = {  // configure fetch post request with data
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'name': toyName,
      'image': toyImage,
      'likes': 0
    })
  }

  const newToy = fetch('http://localhost:3000/toys', config); // send to post to server
}

function getToys(){ // get all toys from server
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then((jresp) => collectToys(jresp))
}

function collectToys(toys){ // goes through each toy and renders info for card
  const toyCollection = document.querySelector("#toy-collection");
  toys.forEach(toy => {
    toyCollection.innerHTML += renderToyCard(toy);
  })
}

function renderToyCard(toy){  // fills in card with each toys info
  return `
    <div class="card">
      <h1 style="display: none">${toy.id}</h1>
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar">
      <p>${toy.likes}</p>
      <button class="like-btn">Like <3</button>
    </div>`
}

function handleLike(e){
  if (e.target.className === 'like-btn') { // checks to make sure like button was target
    const id = parseInt(e.target.parentNode.firstElementChild.innerText);  // gets id of toy
    const config = {  // sets configure for patch request
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'likes': (parseInt(e.target.previousElementSibling.innerText) + 1) // updates like by one
      })
    }
    fetch(`http://localhost:3000/toys/${id}`, config) // updates the server
    .then(resp => resp.json())
    .then(jresp => handlePatch(jresp));

    function handlePatch(resp){ // gets cards, finds correct id, updates count by 1
      let cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        if (card.firstElementChild.innerText == id) {
          card.lastElementChild.previousElementSibling.innerText = parseInt(e.target.previousElementSibling.innerText) + 1;
        }
      });
    }
  }
}

getToys(); // calls getToys after load

