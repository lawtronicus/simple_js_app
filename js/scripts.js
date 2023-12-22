// create protected pokemon object

const pokemonRepository = (function() {
    const myPokemon = [
        {
            name: 'Bulbasur',
            height: 2.04,
            weight: 15.2,
            category: 'Seed',
            types: ['grass', 'poison'] 
        },
        {
            name: 'Charmander',
            height: 2.00,
            weight: 18.7,
            category: 'Lizard',
            types: ['fire'] 
        }, 
        {
            name: 'Squirtle',
            height: 1.08,
            weight: 19.8,
            category: 'Tiny Turtle',
            types: ['water'] 
        },
        {
            name: 'Pikachu',
            height: 1.04,
            weight: 13.2,
            category: 'mouse',
            types: ['electric'] 
        }];

        /**
         * Validates if the input is a correct Pokémon object.
         * @param {Object} pokemon - The object to validate.
         * @return {boolean} True if the object is a valid Pokémon, false otherwise. Should be an object and have at least one of name, height, weight, category, types, or isBig, and nothing else
         */
        function isValidPokemon(obj) {
            const validKeys = ['name', 'height', 'weight', 'category', 'types', 'isBig'];
            const objKeys = Object.keys(obj);

            return (typeof pokemon !== 'object' || pokemon === null || Array.isArray(pokemon)) && 
                    objKeys.every(key => validKeys.includes(key)) &&
                    validKeys.some(key => objKeys.includes(key));
        }
        
        /**
         * Adds a new Pokémon to the repository if it is valid.
         * @param {Object} pokemon - The Pokémon object to add. 
         */
        function add(pokemon) {
            if (!isValidPokemon(pokemon)) {
                console.error('Invalid Pokemon: incorrect properties.');
                return;
            }
            myPokemon.push(pokemon);
        }

        /**
         * Retrieves all Pokémon from the repository.
         * @return {Object[]} An array of all Pokémon objects in the repository.
         */
        function getAll() {
            return myPokemon;
        }

        /** 
         * Finds pokemon that match a particular name
         * @param {string} pokemonName - The name of the pokemon to find
         * @return {Object[]} - An array of pokemon objects matching the name.
        */
        function findPokemonByName(pokemonName) {
            if (typeof pokemonName !== 'string') {
                console.error('pokemonName must be a string');
                return;
            }
            return pokemonRepository.getAll().filter(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase());
        }

        /**
         * adds a Pokemon to the pokemon list
         * @param {Object} pokemon - a pokemon object, the name value of which will be added to the list
         */
        function addListItem(pokemon) {
            const pokemonList = document.querySelector("#pokemon-list");
            let listItem = document.createElement('li');
            let button = document.createElement('button');
            let pokemonName = document.createTextNode(pokemon.name)
    
            button.classList.add('poke-button');         
            button.appendChild(pokemonName);
            button.addEventListener('click', function () {
                showDetails(pokemon);
            });
            listItem.appendChild(button);
            pokemonList.appendChild(listItem);
        };

        /**
         * logs pokemon name to the console
         * @param {*} pokemon - a pokemon object
         */

        function showDetails(pokemon) {
            console.log(pokemon.name);
        };

    return {
        add: add,
        getAll: getAll,
        findPokemonByName: findPokemonByName,
        addListItem: addListItem,
        showDetails: showDetails
    };
})();

/**
 * Adds a 'isBig' property to each pokemon in the array based on their height.
 * @param {Object[]} pokemonArray - Array of pokemon objects.
 * @return {Object[]} New array of pokemon objects with 'isBig' property added.
 */
/*
function addBignessProperty(pokemonArray) {
    return pokemonArray.map(pokemon => {
        return {
            ...pokemon,
            isBig: pokemon.height > 2
        };
    });
 };
*/
/**
 * Writes information about each pokemon to the document, including a special note if the pokemon is big.
 * @param {Object[]} pokemonArray - Array of pokemon objects with 'isBig' property.
 */
/*
function writePokemonListToDoc(pokemonArray) {
    const pokemonList = document.querySelector("#pokemon-list");
    console.log(pokemonList);
    pokemonArray.forEach(pokemon => {
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        let pokemonName = document.createTextNode(pokemon.name)

        button.classList.add('poke-button');
        
        button.appendChild(pokemonName);
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
    });
};
*/

pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));