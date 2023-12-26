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
/*This function does not match well with the pokemon API- WILL MODIFY LATER 
        function isValidPokemon(pokemon) {
            const validKeys = ['name', 'height', 'weight', 'category', 'types', 'isBig', 'detailsUrl'];
            const objKeys = Object.keys(pokemon);

            return (typeof pokemon === 'object' || pokemon != null || !(Array.isArray(pokemon))) && 
                    objKeys.every(key => validKeys.includes(key)) &&
                    validKeys.some(key => objKeys.includes(key));
        }
/*

        /**
         * Adds a new Pokémon to the repository if it is valid.
         * @param {Object} pokemon - The Pokémon object to add. 
         */

        function add(pokemon) {
        /* removing validation check for now as it does not match with the api well
            if (!isValidPokemon(pokemon)) {
                console.error('Invalid Pokemon: incorrect properties.');
                return;
            }
        */
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
         * Finds and returns the first Pokémon object from the repository that matches the provided name.
         *
         * This function searches through the list of all Pokémon in the repository and returns the first one
         * whose name matches the given `pokemonName`. The comparison is case-insensitive. If no matching Pokémon
         * is found, or if the provided name is not a string, it logs an error and returns undefined.
         * 
         * @param {string} pokemonName - The name of the Pokémon to find.
         * @returns {Object|undefined} The found Pokémon object if a match is found; otherwise undefined.
         */
        function findPokemonByName(pokemonName) {
            if (typeof pokemonName !== 'string') {
                console.error('pokemonName must be a string');
                return;
            }
            return pokemonRepository.getAll().filter(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase())[0];
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
        function loadList (){
            return fetch(apiURL).then(function(response) {
                return response.json();
            }).then(function(json) {
                json.results.forEach(function(item) {
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
         * Loads detailed information for a specific Pokémon.
         * 
         * This function fetches additional details about a Pokémon from its detail URL.
         * The details include the Pokémon's height, weight, and types. These details are added to the 
         * Pokémon object by calling the addDetails function.
         * 
         * @param {Object} pokemon - An object representing a Pokémon. It must have a property 'detailsUrl' 
         *                           with the URL to fetch the Pokémon's details.
         * @returns {Promise} A Promise that resolves when the Pokémon's details have been loaded and processed.
         *                    The Promise is rejected if there is an error during the fetch operation or data processing.
         */
        function loadDetails(pokemon) {
            return fetch(pokemon.detailsUrl).then(function(response) {
                return response.json();
            }).then(function(json) {
                console.log(`The pokemon is ${pokemon.name}`);
                addDetails(pokemon.name, 'height', json.height);
                addDetails(pokemon.name, 'weight', json.weight);
                addDetails(pokemon.name, 'types', json.types);
                addDetails(pokemon.name, 'imgUrls', json.sprites);
                addDetails(pokemon.name, 'nextForm', )
            }).catch(function(e) {
                console.error(e);
            })
        }

        /**
         * Adds specific details to a Pokémon object in the repository.
         *
         * This function finds a Pokémon by name using the `findPokemonByName` method of the
         * pokemonRepository. It then adds or updates a specific detail (identified by 'key') 
         * to the found Pokémon object with the provided 'value'.
         * 
         * @param {string} pokemonName - The name of the Pokémon to which the details will be added.
         * @param {string} key - The property key in the Pokémon object that will be added or updated.
         * @param {any} value - The value to be assigned to the specified key in the Pokémon object.
         */
        function addDetails(pokemonName, key, value) {
            pokemonRepository.findPokemonByName(pokemonName)[key] = value;
        }

        /**
         * logs pokemon name to the console
         * @param {*} pokemon - a pokemon object
         */
        function showDetails(pokemon) {
            pokemonRepository.loadDetails(pokemon);
            setTimeout(() => {
                console.log(pokemon)
            },500)
        }



    return {
        add: add,
        getAll: getAll,
        findPokemonByName: findPokemonByName,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails,
    };
})();

pokemonRepository.loadList().then(function() {
    // data loaded
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});

pokemonRepository.getAll();

