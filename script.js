const typeColors = {
  fire: "#f0803093",
  water: "#6891f08f",
  grass: "#78c8508f",
  electric: "#f8d03086",
  poison: "#a040a08e",
  bug: "#a9b82086",
  normal: "#a8a87885",
  ground: "#e0c068",
  fairy: "#ee99ac",
  fighting: "#c03028",
  psychic: "#f85888",
  rock: "#b8a038",
  ghost: "#705898",
  ice: "#98d8d8",
  dragon: "#7238f894",
  dark: "#705848",
  steel: "#b8b8d0",
  flying: "#a890f0"
};

let allPokemons = [];
let currentPokemonIndex = 0;
let newIndex;
let myModal;

function init() {
  myModal = new bootstrap.Modal(document.getElementById('pokemonModal')); // einmal erstellen
  fetchPokemonList();

}

async function fetchPokemonList(currentOffset) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${currentOffset}`);
  let data = await response.json();

  for (let i = 0; i < data.results.length; i++) {
    let detailResponse = await fetch(data.results[i].url);
    let pokemon = await detailResponse.json();
    pokemon.index = i;
    allPokemons.push(pokemon);
    createPokemonCard(pokemon);
  }
}


async function fetchPokemonDetails(url, index) {
  let response = await fetch(url);
  let pokemon = await response.json();
  pokemon.index = index;
  allPokemons[index] = pokemon;
  createPokemonCard(pokemon);
}

function createTypeBadges(types) {
  let badgesHtml = "";
  for (let i = 0; i < types.length; i++) {
    let typeName = types[i].type.name;
    let color = typeColors[typeName];
    badgesHtml += `
      <span class="badge me-1 type" style="background-color:${color} ">
        ${typeName}
      </span>
    `;
  }
  return badgesHtml;
}

function createPokemonCard(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let bgColor = typeColors[mainType];

  document.getElementById('poke-cards').innerHTML += `

  <div class="col">
    <div class="card h-100 text-center" onclick="openPokemonModal(${pokemon.index})" style="background-color:${bgColor};">
        <img src="${pokemon.sprites.front_default}" class="card-img-top mx-auto mt-3" style="width:120px">
     <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div>
            ${createTypeBadges(pokemon.types)}
        </div>
      </div>
    </div>
  </div>
  `;
}
function openPokemonModal(index) {
  currentPokemonIndex = index;
  showPokemonModal(allPokemons[currentPokemonIndex]);
}

async function showPokemonModal(pokemon) { // Parameter jetzt "pokemon"
  document.getElementById("modalLoading").classList.remove("d-none");
  document.getElementById("modalContent").classList.add("d-none");
  myModal.show();

  // Alles innerhalb der Funktion nutzt jetzt "pokemon" statt "pokemonSummary" oder undefiniert
  document.getElementById('pokemonModalLabel').textContent = pokemon.name;
  document.getElementById('modalImage').src = pokemon.sprites.front_default;
  let modalBgColor = typeColors[pokemon.types[0].type.name];
  document.getElementById('modalImage').style.backgroundColor = modalBgColor;

  let typesHtml = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    typesHtml += `<span class="badge me-1" style="background-color:${typeColors[typeName]}; color:white; border-radius:12px; padding:4px 10px;">${typeName}</span>`;
  }
  document.getElementById('modalTypes').innerHTML = typesHtml;

  let statsHtml = "";
  for (let i = 0; i < pokemon.stats.length; i++) {
    statsHtml += ` <tr>
           <td><strong>${pokemon.stats[i].stat.name}:</strong></td>
            <td>${pokemon.stats[i].base_stat}</td>
              <td>  <div class="progress" role="progressbar" aria-label="${pokemon.stats[i].stat.name} stat"
                    aria-valuenow=" ${pokemon.stats[i].base_stat} " aria-valuemin="0" aria-valuemax="150" style="height: 2px">
                    <div class="progress-bar" style="width: ${pokemon.stats[i].base_stat}%;"></div>
                </div>
            </td>
        </tr>`;
  }

  document.getElementById('modalStats').innerHTML = statsHtml;

  let heightInMeters = pokemon.height / 10;
  let weightInKg = pokemon.weight / 10;
  let mainInfoHtml = `
  <div class="info-row">
    <span class="info-label">ID</span>
    <span class="info-value">#${pokemon.id}</span>
  </div>

  <div class="info-row">
    <span class="info-label">Height</span>
    <span class="info-value">${heightInMeters} m</span>
  </div>

  <div class="info-row">
    <span class="info-label">Weight</span>
    <span class="info-value">${weightInKg} kg</span>
  </div>

  <div class="info-row">
    <span class="info-label">Base Exp</span>
    <span class="info-value">${pokemon.base_experience}</span>
  </div>

  <div class="info-row">
    <span class="info-label">Abilities</span>
    <span class="info-value">
      ${pokemon.abilities.map(a => a.ability.name).join(", ")}
    </span>
  </div>
`;

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
   let btn= document.getElementById('loadMoreBtn');
  btn.disabled = false;
}
function showNoResults() {
  let container = document.getElementById('poke-cards');
  container.innerHTML = `
    <div class="centerAlert">
      <p class="alertNoPoke">
        No Pokémon found... 😢
      </p>
    </div>
  `;
  let btn= document.getElementById('loadMoreBtn');
  btn.disabled = true;
}


