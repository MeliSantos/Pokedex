let allPokemons = [];
let currentPokemonIndex = 0;
let myModal;

function init() {
  myModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
  fetchPokemonList();
}

async function fetchPokemonList(currentOffset) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${currentOffset}`);
  let data = await response.json();

  for (let i = 0; i < data.results.length; i++) {
    let detailResponse = await fetch(data.results[i].url);
    let pokemon = await detailResponse.json();
    pokemon.index = allPokemons.length;
    allPokemons.push(pokemon);
    createPokemonCard(pokemon);
  }
}

async function fetchPokemonDetails(url, index) {
  let response = await fetch(url);
  let pokemon = await response.json();
  pokemon.index = indexP;
  allPokemons[indexP] = pokemon;
  createPokemonCard(pokemon);
}

function createTypeBadges(types) {
  let badgesHtml = "";
  for (let i = 0; i < types.length; i++) {
    let typeName = types[i].type.name;
    let color = typeColors[typeName];
    badgesHtml += typeBadges(typeName, color);
  }
  return badgesHtml;
}

function createPokemonCard(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let bgColor = typeColors[mainType];
  document.getElementById('poke-cards').innerHTML += getPokeCard(pokemon);
}

function openPokemonModal(index) {
  currentPokemonIndex = index;
  showPokemonModal(allPokemons[currentPokemonIndex]);
}

async function showPokemonModal(pokemon) {
  document.getElementById("modalLoading").classList.remove("d-none");
  document.getElementById("modalContent").classList.add("d-none");
  myModal.show();
  document.getElementById('pokemonModalLabel').textContent = pokemon.name;
  document.getElementById('modalImage').src = pokemon.sprites.front_default;
  let modalBgColor = typeColors[pokemon.types[0].type.name];
  document.getElementById('modalImage').style.backgroundColor = modalBgColor;
  let typesHtml = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    typesHtml += typeModal(typeColors, typeName);
  }
  document.getElementById('modalTypes').innerHTML = typesHtml;

  let statsHtml = "";
  for (let i = 0; i < pokemon.stats.length; i++) {
    statsHtml += pokemonStats(pokemon, i);
  }
  document.getElementById('modalStats').innerHTML = statsHtml;

  let heightInMeters = pokemon.height / 10;
  let weightInKg = pokemon.weight / 10;
  let mainInfoHtml = mainInfo(pokemon, heightInMeters, weightInKg);
  document.getElementById("modalMainInfo").innerHTML = mainInfoHtml;
  document.getElementById("modalLoading").classList.add("d-none");
  document.getElementById("modalContent").classList.remove("d-none");
}

async function showNext(direction) {
  if (currentPokemonIndex === -1) return;
  if (direction === 'next') {
    currentPokemonIndex = (currentPokemonIndex + 1) % allPokemons.length;
  } else {
    currentPokemonIndex = (currentPokemonIndex - 1 + allPokemons.length) % allPokemons.length;
  }
  await showPokemonModal(allPokemons[currentPokemonIndex]);
}

const triggerTabList = document.querySelectorAll('#myTab button')
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})

function searchPokemon() {
  let inputField = document.getElementById('searchInput');
  let input = inputField.value.toLowerCase().trim();
  if (input.length < 3) {
    displayPokemonCards(allPokemons);
    alert(' Please enter more than 2 letters to start the search.. ')
    return;
  }
  let filteredPokemons = allPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(input)
  );

  if (filteredPokemons.length === 0) {
    showNoResults();
  } else {
    displayPokemonCards(filteredPokemons);
  }
  inputField.value = "";
}

function displayPokemonCards(pokemonList) {
  let container = document.getElementById('poke-cards');
  container.innerHTML = '';

  pokemonList.forEach(pokemon => {
    createPokemonCard(pokemon);
  });
  let btn = document.getElementById('loadMoreBtn');
  btn.disabled = false;
}

function showNoResults() {
  let container = document.getElementById('poke-cards');
  container.innerHTML = noResult();
  let btn = document.getElementById('loadMoreBtn');
  btn.disabled = true;
}


