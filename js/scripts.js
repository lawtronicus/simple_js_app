// create protected pokemon object

let pokemonRepository = (function() {
    let myPokemon = [];
    let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    //

        /**
         * Validates if the input is a correct Pokémon object.
         * @param {Object} pokemon - The object to validate.
         * @return {boolean} True if the object is a valid Pokémon, false otherwise. Should be an object and have at least one of name, height, weight, category, types, or isBig, and nothing else
         */
        function isValidPokemon(pokemon) {
            const validKeys = ['name', 'height', 'weight', 'category', 'types', 'isBig', 'detailsUrl'];
            const objKeys = Object.keys(pokemon);

            return (typeof pokemon === 'object' || pokemon != null || !(Array.isArray(pokemon))) && 
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
            const pokemonList = document.querySelector('#pokemon-list');
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

        function loadList (){
            return fetch(apiURL).then(function (response) {
                return response.json();
            }).then(function (json) {
                json.results.forEach(function (item) {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            }).catch(function (e) {
                console.error(e);
            })
        }

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
        showDetails: showDetails,
        loadList: loadList
    };
})();

pokemonRepository.loadList().then(function() {
    // data loaded
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});