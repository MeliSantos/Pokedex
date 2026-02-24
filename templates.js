function typeBadges(typeName, color) {
    return `
      <span class="badge me-1 type" style="background-color:${color} ">
        ${typeName}
      </span>
    `;
}

function getPokeCard(pokemon, bgColor) {
    return `
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

function typeModal(typeColors, typeName){
    return `<span class="badge me-1" style="background-color:${typeColors[typeName]}; color:white; border-radius:12px; padding:4px 10px;">${typeName}</span>`;
}

function pokemonStats(pokemon,i){
return ` <tr>
           <td><strong>${pokemon.stats[i].stat.name}:</strong></td>
            <td>${pokemon.stats[i].base_stat}</td>
              <td>  <div class="progress" role="progressbar" aria-label="${pokemon.stats[i].stat.name} stat"
                    aria-valuenow=" ${pokemon.stats[i].base_stat} " aria-valuemin="0" aria-valuemax="150" style="height: 2px">
                    <div class="progress-bar" style="width: ${pokemon.stats[i].base_stat}%;"></div>
                </div>
            </td>
        </tr>`;
}

function mainInfo(pokemon, heightInMeters,weightInKg){
    return `
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
  </div>`;
}

function noResult(){
    return `
    <div class="centerAlert">
      <p class="alertNoPoke">
        No Pokémon found... 😢
      </p>
    </div>
  `;
}
