const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
// const POKEMON_URL = "http://pokeapi.salestock.net/api/v2/pokemon"; // backup url

class Trainer {
  constructor(name) {
    this.name = name;
    this.pokedex = [];
  }

  all() {
    return this.pokedex;
  }

  get(pokemon) { // pass in pokemon name as a string
    for (var i = 0; i < this.pokedex.length; i++) {
      if (this.pokedex[i].name === pokemon) { return this.pokedex[i] }
    }
  }

  show(i) {
    let $pokeNameId = $(`<h2>${this.pokedex[i].name}</h2><h2>no: ${this.pokedex[i].id}</h2>`);
    $( "#name-display" ).html($pokeNameId);
    let $baseStats = $(`<h3>HP: ${this.pokedex[i].hp}</h3><h3>attack: ${this.pokedex[i].attack}</h3><h3>defense: ${this.pokedex[i].defense}</h3>`);
    $( "#base-stats" ).html($baseStats);
    $( "#abilities" ).html("</br><h3>abilities:</h3>" + `<h3>${this.pokedex[i].abilities.join(", ")}</h3>`);
    let $image = $(`<img class="pokemon-image" src="${this.pokedex[i].image}" alt="${this.pokedex[i].name}">`);
    $ ("#image-display" ).html($image);
    $( "#types" ).html("</br><h3>type:</h3>" + `<h3>${this.pokedex[i].type.join(", ")}</h3>`);

    $( "#right-arrow" ).click(function(e) {
      i === newTrainer.pokedex.length - 1 ? i = 0 : i++;
      newTrainer.show(i);
    });

    $( "#left-arrow" ).click(function() {
      i === 0 ? i = newTrainer.pokedex.length - 1 : i--;
      newTrainer.show(i);
    });

    if (this.pokedex[i].type.length === 2) {
      $( "#image-display" ).css("background", `linear-gradient(90deg, var(--${this.pokedex[i].type[0]}) 50%, var(--${this.pokedex[i].type[1]}) 50%)`);
    } else {
      $( "#image-display" ).css("background", `var(--${this.pokedex[i].type[0]})`);
    }

  }
}

class Pokemon {
  constructor(id, name, defense, attack, hp, abilities, image, type) {
    this.id = id;
    this.name = name;
    this.defense = defense;
    this.attack = attack;
    this.hp = hp;
    this.abilities = abilities;
    this.image = image;
    this.type = type;
  }
}

function createPokemon(id) {
  return $.ajax({
    url: POKEMON_URL + id,
    dataType: 'json',
    type: "GET",
  }).done(function(data) {
      console.log("success!");
      name = data.name;
      defenseStat = data.stats[3].base_stat;
      attackStat = data.stats[4].base_stat;
      hpStat = data.stats[5].base_stat;
      // TODO: refactor grabbing abilities array
      let sortAbilities = function() {
        let abilities = [];
        for (var i = 0; i < data.abilities.length; i++) {
          abilities.push(data.abilities[i].ability.name);
        }
        return abilities;
      }
      abilities = sortAbilities();
      image = data.sprites.front_default;
      // TODO: refactor grabbing types array
      let sortTypes = function() {
        let types = [];
        for (var i = 0; i < data.types.length; i++) {
          types.push(data.types[i].type.name);
        }
        return types;
      }
      types = sortTypes();
      let myPokemon = new Pokemon(id, name, defenseStat, attackStat, hpStat, abilities, image, types);
      newTrainer.pokedex.push(myPokemon);
  }).fail(function() {
      alert("404 not found");
  });
}

let newTrainer = new Trainer("mokaymon");
$.when(createPokemon(130)
  ).done(
    createPokemon(131)
  ).done(
    createPokemon(143)
  ).done(function() {
    newTrainer.show(0); // pass in 0 by default to show first pokemon
});

$( "#stats-button" ).click(function(){
  if ($( "#hide-yo-stats" ).css('display') == 'none') {
    $( "#hide-yo-stats" ).slideDown(800);
  } else {
    $( "#hide-yo-stats" ).hide();
  }
});
