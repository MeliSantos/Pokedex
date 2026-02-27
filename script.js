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

function toggleModalLoading(isLoading) {
  document.getElementById("modalLoading").classList.toggle("d-none", !isLoading);
  document.getElementById("modalContent").classList.toggle("d-none", isLoading);
}

function renderModalHeader(pokemon) {
  document.getElementById('pokemonModalLabel').textContent = pokemon.name;
  document.getElementById('modalImage').src = pokemon.sprites.front_default;
  document.getElementById('modalImage').style.backgroundColor =
    typeColors[pokemon.types[0].type.name];
}

function renderModalTypes(pokemon) {
  let typesHtml = "";
  pokemon.types.forEach(type => {
    typesHtml += typeModal(typeColors, type.type.name);
  });
  document.getElementById('modalTypes').innerHTML = typesHtml;
}

function renderModalStats(pokemon) {
  let statsHtml = "";
  for (let i = 0; i < pokemon.stats.length; i++) {
    statsHtml += pokemonStats(pokemon, i);
  }
  document.getElementById('modalStats').innerHTML = statsHtml;
}

function renderModalMainInfo(pokemon) {
  let height = pokemon.height / 10;
  let weight = pokemon.weight / 10;
  document.getElementById("modalMainInfo").innerHTML =
    mainInfo(pokemon, height, weight);
}

async function showPokemonModal(pokemon) {
  toggleModalLoading(true);
  myModal.show();
  renderModalHeader(pokemon);
  renderModalTypes(pokemon);
  renderModalStats(pokemon);
  renderModalMainInfo(pokemon);
  toggleModalLoading(false);
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
    document.getElementById("mainHeadline").style.display = "block";
    displayPokemonCards(allPokemons);
    alert('Please enter more than 2 letters.');
    return;
  }
  let filteredPokemons = allPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(input));
  document.getElementById("mainHeadline").style.display = "none";
  handleSearchResult(filteredPokemons);
  inputField.value = "";
}

function handleSearchResult(filteredPokemons) {
  if (filteredPokemons.length === 0) {
    showNoResults();
  } else {
    displayPokemonCards(filteredPokemons);
  }
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