// create protected pokemon object

let pokemonRepository = (function() {
    let myPokemon = [];
    let detailedPokemon = {};
    let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

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
    function loadList() {
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

    function addPokemonToMyPokemon(pokemonName) {
        let api = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        return fetch(api).then(function(response) {
            return response.json();
        }).then(function(pokemon) {
                let newPokemon = {
                    name: pokemon.name,
                    detailsUrl: api
                };
                add(newPokemon);
                pokemonRepository.addListItem(newPokemon);
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
        // Check if details are already loaded 
        if (detailedPokemon[pokemon.name]) {
            return Promise.resolve(detailedPokemon[pokemon.name]);
        }

        // Fetch details and derive evolutionary tree
        let detailsPromise = fetch(pokemon.detailsUrl).then(response => response.json());
        let evolutionaryTreePromise = deriveEvolutionaryTree(pokemon);

        return Promise.all([detailsPromise, evolutionaryTreePromise])
        .then(([details, evolutionaryTree]) => {

            let detailsObject = {
                height: details.height,
                weight: details.weight,
                types: details.types.map(typeItem => typeItem.type.name),
                imgUrls: details.sprites,
                forms: evolutionaryTree
            }
            //store details for future
            detailedPokemon[pokemon.name] = detailsObject;
            return detailedPokemon[pokemon.name];
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
    function addDetails(pokemon, detailsObject) {
        Object.keys(detailsObject).forEach(function(key) {
            pokemon[key] = detailsObject[key];
        })
    }

    function parseEvolutionaryTree(evolutionaryTreeJson) {
        let pokemonForms = [];

        function traverse(evolutionaryStep) {
            if (evolutionaryStep.species) {
                pokemonForms.push(evolutionaryStep.species.name); // add species name
            }

            // Check if 'evolves_to' is not empty and call the function recursively if not
            if (evolutionaryStep.evolves_to && evolutionaryStep.evolves_to.length > 0) {
                evolutionaryStep.evolves_to.forEach(nextStep => traverse(nextStep));
            }
        }
        
        // start traversal from top level, which has a slightly different structure
        if (evolutionaryTreeJson && evolutionaryTreeJson.chain) {
            traverse(evolutionaryTreeJson.chain);
        }

        traverse(evolutionaryTreeJson);
        return pokemonForms;
    }

    function deriveEvolutionaryTree(pokemon){
        return getEvolutionaryTreeUrl(pokemon)
        .then(evolutionaryChainUrl => fetch(evolutionaryChainUrl))
        .then(response => response.json())
        .then(json => parseEvolutionaryTree(json))
        .catch(error => console.error("Error in fetching evolutionary tree:", error));
    }

    function getEvolutionaryTreeUrl(pokemon) {
        pokemonName = pokemon.name;
        evolutionaryTreeUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
        return fetch (evolutionaryTreeUrl).then(function(response) {
            return response.json();
        }).then(function(speciesDetails){
            evolutionaryChainUrl = speciesDetails['evolution_chain']['url'];
            return evolutionaryChainUrl;
        })
    }

    function determineSideImageOrder(pokemon, evolutionArray) {

        let imageOrder = {
            leftImage: "",
            rightImage: ""
        };

        if (!evolutionArray.includes(pokemon.name)) {
            console.log(pokemon.name);
            console.log(evolutionArray);
            throw "The pokemon is not in the array";
        }

        if (evolutionArray.length >= 3) {

            if (evolutionArray.indexOf(pokemon.name) === 0) {
                imageOrder.leftImage = evolutionArray[1];
                imageOrder.rightImage = evolutionArray[2];
            } else if (evolutionArray.indexOf(pokemon.name) === 1) {
                imageOrder.leftImage = evolutionArray[0];
                imageOrder.rightImage = evolutionArray[2];
            } else {
                imageOrder.leftImage = evolutionArray[0];
                imageOrder.rightImage = evolutionArray[1];
            }

        } else if (evolutionArray.length === 2) {
            if (evolutionArray.indexOf(pokemon.name) === 0) {
                imageOrder.leftImage = null;
                imageOrder.rightImage = evolutionArray[1];
            } else if (evolutionArray.indexOf(pokemon.name) === 1) {
                imageOrder.leftImage = evolutionArray[0];
                imageOrder.rightImage = null;
            }
        } else {
            imageOrder.leftImage = null;
            imageOrder.rightImage = null;
        }

        return imageOrder;
    };


    function showEvolutionaryTreeDetails(pokemon) {
        let evolutionaryTree = detailedPokemon[pokemon.name].forms;
        let detailPromises = evolutionaryTree.map(name => {
            if (!detailedPokemon[name]) {
                // Details not loaded, fetch them
                // If pokemon not in myPokemonArray, add them
                if (!pokemonRepository.findPokemonByName(name)) {
                    addPokemonToMyPokemon(name)
                    .then(function() {
                        let evolutionaryPokemon = pokemonRepository.findPokemonByName(name);
                        return loadDetails(evolutionaryPokemon);
                    });
                } else {
                    let evolutionaryPokemon = pokemonRepository.findPokemonByName(name);
                    return loadDetails(evolutionaryPokemon);
                }
            } else {
                return Promise.resolve(detailedPokemon[name]);
            }
        });

        return Promise.all(detailPromises)
    }

    /** 
     * This function hides the pokemon details modal 
     */
    function hidePokemonDetailsModal() {
        const modal = document.querySelector(".box")
        modal.style.visibility = "hidden";
    }

    /**
     * logs pokemon name to the console
     * @param {*} pokemon - a pokemon object
     */
    function showDetails(pokemon) {
    //    let promise1 = loadDetails(pokemon);
    //    let promise2 = deriveEvolutionaryTree(pokemon);
        let hideModal;
        const  modal = document.querySelector(".box")
        modal.style.visibility = "visible";

        const closeDetails = document.querySelector(".close-details");
        closeDetails.style.visibility = "visible";

        //focus on close button to make for easier closing
        closeButton = document.getElementById('close-button');
        closeButton.focus();

        loadDetails(pokemon)
            .then((detailsObject) => {
                // Get document elements to be updated
                const pokeName = document.querySelector('.name > h4');
                const pokeHeightValue = document.querySelector('.values > .poke-height');
                const pokeWeightValue = document.querySelector('.values > .poke-weight');
                const pokeTypesValue = document.querySelector('.values > .poke-types');
                const cardBackgroundDiv = document.querySelector('.pokemon-card');
                const divForSprite = document.querySelector('.imgBx');
                const leftImageDiv = document.querySelector('.bg1')
                const rightImageDiv = document.querySelector('.bg2');
                
                let sprite = document.getElementById('pokemon_sprite');

                let sideImages = document.querySelectorAll('.bg > img')
                console.log(sideImages);

                // remove existing sprite image if it exists
                if (sprite) {
                    sprite.remove();
                }

                //hide side image divs
                leftImageDiv.style.visibility = "hidden";
                rightImageDiv.style.visibility = "hidden";
                //remove side images if they exist;
                if (sideImages != []) {
                    sideImages.forEach(function(item) {
                        item.remove();
                    })
                }


                // create img element for sprite
                const pokeImageElement = document.createElement("img");

                // create img element for left image
                const leftImageElement = document.createElement("img");

                //create img element for right image
                const rightImageElement = document.createElement("img")

                // get link for background image
                const cardBackgroundImage = detailedPokemon[pokemon.name].imgUrls.other['official-artwork']['front_default'];

                // get link for sprite image
                let pokeImage;

                if (detailedPokemon[pokemon.name].imgUrls.other['dream_world']['front_default']) {
                    pokeImage = detailedPokemon[pokemon.name].imgUrls.other['dream_world']['front_default']
                } else {
                    pokeImage = detailedPokemon[pokemon.name].imgUrls.other['home']['front_default']
                }
                if (pokeName && pokeHeightValue && pokeWeightValue && pokeTypesValue && detailedPokemon[pokemon.name]) {
                    pokeName.innerText = `Name: ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
                    pokeHeightValue.innerText = `${detailedPokemon[pokemon.name].height} decimeters`;
                    pokeWeightValue.innerText = `${detailedPokemon[pokemon.name].weight} hectograms`;

                    // Transform tye types array to a string of type names
                    let typeStr = detailedPokemon[pokemon.name].types.join(', ');
                    pokeTypesValue.innerText = typeStr;
                    
                    //change background image
                    cardBackgroundDiv.style.backgroundImage = `url(${cardBackgroundImage})`;

                    // change sprite image
                    pokeImageElement.setAttribute("src", pokeImage);
                    pokeImageElement.setAttribute("alt", "main pokemon image");
                    pokeImageElement.setAttribute("id", 'pokemon_sprite');
                    divForSprite.append(pokeImageElement);

                    // assign side images
                    showEvolutionaryTreeDetails(pokemon)
                    .then(function() {
                        let sideImageOrder = determineSideImageOrder(pokemon, detailedPokemon[pokemon.name].forms);
                        let leftImageUrl = detailedPokemon[sideImageOrder.leftImage] ? detailedPokemon[sideImageOrder.leftImage].imgUrls["front_default"] : null;
                        let rightImageUrl = detailedPokemon[sideImageOrder.rightImage] ? detailedPokemon[sideImageOrder.rightImage].imgUrls["front_default"]: null;

                        if (leftImageUrl != null) {
                            leftImageElement.setAttribute("src", leftImageUrl);
                            leftImageElement.setAttribute("alt", "Previous pokemon form");
                            leftImageDiv.appendChild(leftImageElement);
                            leftImageDiv.style.visibility = "visible"

                        }

                        if (rightImageUrl != null) {
                            rightImageElement.setAttribute("src", rightImageUrl);
                            rightImageElement.setAttribute("alt", "Next pokemon evolutionary form");
                            rightImageDiv.appendChild(rightImageElement);
                            rightImageDiv.style.visibility = "visible"
                        }
                    });



                } else {
                    console.log("Attribute or Pokemon not found.");
                }
            });
    }

    let modal = document.querySelector('.box');
    let modalChildren = document.querySelectorAll('.box > *');
    let leftImageDiv = document.querySelector('.bg1')
    let rightImageDiv = document.querySelector('.bg2');
    //get close button
    closeButton = document.getElementById('close-button');
    //hide model if close button is clicked
    closeButton.addEventListener('click', () => {
        modal.style.visibility = "hidden";
        leftImageDiv.style.visibility = "hidden";
        rightImageDiv.style.visibility = "hidden";
        closeButton.style.visibility = "hidden";
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.visibility = "hidden";
            leftImageDiv.style.visibility = "hidden";
            rightImageDiv.style.visibility = "hidden";
            closeButton.style.visibility = "hidden";
        }
    })
/*
            loadDetails(pokemon);
            pokeHeightValue = document.querySelector('.values > .poke-height');
            pokeHeightValue.innerText = pokemon.height;
            console.log(pokemon);
        }
*/


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
