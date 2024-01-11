let myPokedex = (function () {
  // assign variables

  // initial list that will contain an array of objects made up of a pokemon name and a url to detailed info about that pokemon
  let myPokemon = []

  // Assign api to variable
  const API_URL = "https://pokeapi.co/api/v2/pokemon/?limit=151"

  //an object that will contain a set of keys which will be poke on names, and detailed info about those pokemon as the
  let detailedPokemon = {}

  //Create fragment for more efficiently adding pokemon to pokedex
  let fragment = document.createDocumentFragment()

  // create object variable for gradients

  const typeGradients = {
    normal: "linear-gradient(45deg, #A8A878, #C0C0A0)",
    fighting: "linear-gradient(45deg, #C03028, #E05050)",
    flying: "linear-gradient(45deg, #A890F0, #C0B0FF)",
    poison: "linear-gradient(45deg, #A040A0, #C060E0)",
    ground: "linear-gradient(45deg, #E0C068, #F0E090)",
    rock: "linear-gradient(45deg, #B8A038, #D0C070)",
    bug: "linear-gradient(45deg, #A8B820, #C0D060)",
    ghost: "linear-gradient(45deg, #705898, #9080C0)",
    steel: "linear-gradient(45deg, #B8B8D0, #D0D0FF)",
    fire: "linear-gradient(45deg, #F08030, #F0A060)",
    water: "linear-gradient(45deg, #6890F0, #88B0FF)",
    grass: "linear-gradient(45deg, #78C850, #98E890)",
    electric: "linear-gradient(45deg, #F8D030, #F8F060)",
    psychic: "linear-gradient(45deg, #F85888, #F880B0)",
    ice: "linear-gradient(45deg, #98D8D8, #B8F8F8)",
    dragon: "linear-gradient(45deg, #7038F8, #9070FF)",
    dark: "linear-gradient(45deg, #705848, #908078)",
    fairy: "linear-gradient(45deg, #EE99AC, #FFB8D0)",
    unknown: "linear-gradient(45deg, #68A090, #88C0B0)",
    shadow: "linear-gradient(45deg, #604E82, #8070A0)"
  }

  // create object variable for colors

  const typeColors = {
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    unknown: "#68A090",
    shadow: "#604E82"
  }

  // set ability colors for the ability bar
  const abilityColors = {
    hp: "#4CAF50",
    attack: "#F44336",
    defense: "#2196F3",
    "special-attack": "#9C27B0",
    "special-defense": "#FFD700",
    speed: "#FF9800"
  }

  /**
   * Adds a new Pokémon to the repository if it's not already present.
   * @param {Object} pokemon - The Pokémon object to add.
   */
  function add(pokemon) {
    // Check if the pokemon is already in the array
    const exists = myPokemon.some((p) => p.name === pokemon.name)
    if (!exists) {
      myPokemon = [...myPokemon, pokemon]
    } else {
      console.warn(`Pokémon with the name '${pokemon.name}' already exists.`)
    }
  }

  /**
   * Retrieves all Pokémon from the repository.
   * Returns a copy of the Pokémon array to maintain immutability.
   * @return {Object[]} An array of all Pokémon objects in the repository.
   */
  function getAll() {
    return [...myPokemon]
  }

  /**
   * Finds and returns the Pokémon object from the repository that matches the provided name.
   * The comparison is case-insensitive. If no matching Pokémon
   * is found, or if the provided name is not a string, it logs an error and returns undefined.
   *
   * @param {string} pokemonName - The name of the Pokémon to find.
   * @returns {Object|undefined} The found Pokémon object if a match is found; otherwise undefined.
   */
  function findPokemonByName(pokemonName) {
    let result

    if (typeof pokemonName !== "string") {
      console.error("pokemonName must be a string")
      return undefined
    }
    result = myPokemon.find(
      (pokemon) => pokemon.name.toLowerCase() === pokemonName.toLowerCase()
    )
    if (!result) {
      console.log("Pokemon not found in findPokemonByName function")
    }
    return result
  }

  /**
   * Sets the background color of a button element based on the Pokémon's type.
   *
   * The function determines the main type of the Pokémon and then assigns a
   * background color to the button element based on this type. If the Pokémon's
   * type is not found in the typeGradients mapping, a default color is used.
   *
   * @param {Object} pokemon - An object representing a Pokémon.
   *                           It must have a 'types' array with each type having a 'type' object containing a 'name' property.
   * @param {HTMLElement} buttonElement - The button element to which the background color will be applied.
   */
  function setBackgroundColor(pokemon, buttonElement) {
    const mainType = detailedPokemon[pokemon.name].types[0] // Assuming the first type is the main type
    const gradient = typeGradients[mainType] || "#A8A878" // Default color if type not found
    buttonElement.style.background = gradient
  }

  /**
   * Adds a Pokémon item to a fragment.
   * The function creates a list item and a button for each Pokémon.
   * This button, when clicked, triggers the display of the Pokémon's details.
   * The created list item is appended to a document fragment for efficient DOM manipulation.
   * Actual appending to the DOM is done by `appendAllItems` function.
   * @param {Object} pokemon - A Pokémon object to add to the list.
   */
  function addListItem(pokemon) {
    // check that pokemon has a name
    if (!pokemon.name) {
      console.error(
        "<li> item failed to be added in addListItem because object ",
        pokemon,
        " does not have a name property"
      )
      return
    }

    let listItem = document.createElement("li")
    let button = document.createElement("button")
    let buttonText = document.createElement("p")
    let buttonImage = document.createElement("img")

    // set attributes for the li
    listItem.classList.add("text-center", "poke-card", "m-1")

    // set attributes for the button
    button.classList.add("btn", "poke-button")
    button.setAttribute("type", "button")
    button.setAttribute("data-toggle", "modal")
    button.setAttribute("data-target", "#pokemon-details-modal")
    button.setAttribute("aria-label", `View details for ${pokemon.name}`) // label for accessibility

    // set background color for button based on type
    setBackgroundColor(pokemon, listItem)

    // set attributes for the image
    buttonImage.setAttribute(
      "src",
      detailedPokemon[pokemon.name].imgUrls.other.dream_world.front_default
    )

    buttonImage.setAttribute("loading", "lazy")
    buttonImage.setAttribute("alt", `${pokemon.name} image`)
    buttonImage.style.filter = "drop-shadow(0 0 3px black)"

    buttonText.textContent = pokemon.name // Directly setting the text content
    button.appendChild(buttonImage)
    button.appendChild(buttonText)

    // Add event listener to button
    button.addEventListener("click", function () {
      styleModal(pokemon)
    })

    listItem.appendChild(button)
    fragment.appendChild(listItem)
  }

  /**
   * Appends all items from the fragment to the main Pokémon list in the DOM.
   * This function is called after all Pokémon items have been added to the fragment,
   * allowing for efficient batched updates to the DOM.
   */
  function appendAllItems() {
    const pokemonList = document.querySelector("#pokemon-list")

    if (pokemonList) {
      pokemonList.appendChild(fragment)
    } else {
      console.error("The #pokemon-list element does not exist in the DOM")
    }
  }

  /**
   * Loads a list of Pokémon from a specified API.
   *
   * This function fetches data from the Pokémon API, parses the JSON response,
   * and then iterates over the results to create and add Pokémon objects to the repository.
   * Each Pokémon object contains the Pokémon's name and a URL with more details.
   *
   * @returns {Promise} A Promise that resolves when the Pokémon list has been loaded and processed.
   *                    The Promise is rejected if there is an error during the fetch operation or data processing.
   */
  function loadList() {
    return fetch(API_URL)
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach((item) => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          }
          add(pokemon)
        })
      })
      .catch((e) => {
        console.error("Error loading Pokémon list:", e)
      })
  }

  /**
   * Loads detailed information for a specific Pokémon, including its evolutionary tree.
   *
   * This function first checks if the details are already loaded in `detailedPokemon`.
   * If not, it fetches the details from the Pokémon's `detailsUrl` and also derives its evolutionary tree.
   * The details and the evolutionary tree are then stored for future use.
   *
   * @param {Object} pokemon - An object representing a Pokémon, must have a 'detailsUrl' property.
   * @returns {Promise} A Promise that resolves with detailed information of the Pokémon.
   */
  async function loadDetails(pokemon) {
    if (detailedPokemon[pokemon.name]) {
      return detailedPokemon[pokemon.name]
    }

    if (!pokemon.detailsUrl) {
      throw new Error("No details URL provided for the Pokémon.")
    }

    try {
      const response = await fetch(pokemon.detailsUrl)
      const details = await response.json()

      let detailsObject = {
        name: pokemon.name,
        height: details.height,
        weight: details.weight,
        types: details.types.map((typeItem) => typeItem.type.name),
        imgUrls: details.sprites,
        abilities: details.abilities,
        stats: details.stats
      }

      detailedPokemon[pokemon.name] = detailsObject
      return detailsObject
    } catch (e) {
      console.error(`Error loading details for ${pokemon.name}:`, e)
      throw e
    }
  }

  /**
   * This function removes appended modal elements
   */
  function removeAppendedElements() {
    const pokeTypes = document.getElementById("types")
    while (pokeTypes.firstChild) {
      pokeTypes.removeChild(pokeTypes.firstChild)
    }
  }

  /**
   * This function will set the styling on the ability bar based on the pokemon ability score
   */
  function styleAbilityBar(ability, score) {
    const scorePercentage = (score / 160) * 100
    document.getElementById(`${ability}`).style.width = scorePercentage + "%"
    document.getElementById(`${ability}`).style.backgroundColor =
      abilityColors[ability]
  }

  /**
   * This function styles the modal based on the pokemon button that is clicked.
   * The modal can be closed by hitting the close button, clicking escape, or clicking outside of the modal
   * @param {object} pokemon - An object representing a Pokémon, must have a 'detailsUrl' property.
   */
  function styleModal(pokemon) {
    // remove appended elements
    removeAppendedElements()
    // get detailed pokemon object
    const pokemonData = detailedPokemon[pokemon.name]

    //get modal elements
    const pokeName = document.getElementById("poke-name")
    const modalHeader = document.querySelector(".modal-header")
    const pokeTypes = document.getElementById("types")
    const pokeHeight = document.getElementById("height")
    const pokeWeight = document.getElementById("weight")
    const pokeImage = document.getElementById("pokemon-details-img")

    // create p elements for the types, give them margin, create the text, and append
    pokemonData.types.forEach((type) => {
      const p = document.createElement("p")
      p.textContent = type
      p.classList.add("mr-4", "ml-4")
      p.style.background = typeColors[type]
      pokeTypes.appendChild(p)
    })

    // set background color for header
    modalHeader.style.background = typeGradients[pokemonData["types"][0]]

    // assign pokemon image and give attributes
    pokeImage.setAttribute(
      "src",
      `${detailedPokemon[pokemon.name].imgUrls.other.dream_world.front_default}`
    )
    pokeImage.setAttribute("alt", `${pokemon.name} image`)

    // assign values
    pokeName.innerText = pokemonData.name
    pokeHeight.innerText = pokemonData.height
    pokeWeight.innerText = pokemonData.weight

    // style ability score bars based on ability scores
    pokemonData.stats.forEach((stat) => {
      styleAbilityBar(stat.stat.name, stat["base_stat"])
    })
  }

  return {
    // public methods and properties here
    add: add,
    getAll: getAll,
    findPokemonByName: findPokemonByName,
    addListItem: addListItem,
    appendAllItems: appendAllItems,
    loadList: loadList,
    loadDetails: loadDetails
  }
})()

myPokedex.loadList().then(function () {
  // data loaded
  myPokedex.getAll().forEach(function (pokemon) {
    myPokedex
      .loadDetails(pokemon)
      .then(function () {
        myPokedex.addListItem(pokemon)
      })
      .then(function () {
        myPokedex.appendAllItems()
      })
  })
})
