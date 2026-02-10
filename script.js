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

function init() {
  fetchPokemonList();
}

async function fetchPokemonList() {
  let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25&offset=0');
  let data = await response.json();

  data.results.forEach(pokemon => {
    fetchPokemonDetails(pokemon.url);
  });
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  let pokemon = await response.json();
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
    <div class="card h-100 text-center"  style="background-color:${bgColor}">
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

