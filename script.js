let allPokemons = [];
let currentPokemonIndex = 0;
let myModal;
let currentList = allPokemons;

function init() {
  myModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
  fetchPokemonList();
}

async function fetchPokemonList(currentOffset = 0) {
  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${currentOffset}`);
  let data = await response.json();
  let pokemonPromises = data.results.map(async (pokemonData) => {
    let detailResponse = await fetch(pokemonData.url);
    return await detailResponse.json();
  });
  let newPokemons = await Promise.all(pokemonPromises);
  newPokemons.forEach((pokemon, index) => {
    pokemon.index = allPokemons.length + index;
  });
  allPokemons.push(...newPokemons);
  displayPokemonCards(allPokemons);
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

  document.getElementById("prevPokemon").disabled = currentList.length <= 1;
  document.getElementById("nextPokemon").disabled = currentList.length <= 1;
}

async function showNext(direction) {
  if (currentPokemonIndex === -1) return;
  const list = currentList;
  if (direction === 'next') currentPokemonIndex = (currentPokemonIndex + 1) % list.length;
  else currentPokemonIndex = (currentPokemonIndex - 1 + list.length) % list.length;
  await showPokemonModal(list[currentPokemonIndex]);
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
  let input = document.getElementById('searchInput').value.toLowerCase().trim();
  if (input.length < 3) {
    document.getElementById("mainHeadline").style.display = "block";
    currentList = allPokemons;
    displayPokemonCards(allPokemons);
    alert('Please enter more than 2 letters.');
    return;
  }
  let filtered = allPokemons.filter(p => p.name.toLowerCase().includes(input));
  document.getElementById("mainHeadline").style.display = "none";
  currentList = filtered;
  document.getElementById("goHomeContainer").classList.remove("d-none");
  if (filtered.length === 0) showNoResults();
  else displayPokemonCards(filtered);
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

function togglePageLoading(isLoading) {
  document.getElementById("pageLoading")
    .classList.toggle("d-none", !isLoading);
}

async function loadMore() {
  let btn = document.getElementById("loadMoreBtn");
  btn.disabled = true;
  togglePageLoading(true);

  await fetchPokemonList(allPokemons.length);

  togglePageLoading(false);
  btn.disabled = false;
}

function goHome() {
  document.getElementById("searchInput").value = "";
  document.getElementById("mainHeadline").style.display = "block";
  currentList = allPokemons;
  displayPokemonCards(allPokemons);
  document.getElementById("goHomeContainer").classList.add("d-none");
}