// create protected pokemon object

let pokemonRepository = (function() {
    let myPokemon = [];
    let detailedPokemon = {};
    const API_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

    /**
     * Adds a new Pokémon to the repository if it's not already present.
     * @param {Object} pokemon - The Pokémon object to add.
     */
    function add(pokemon) {
        // Check if the pokemon is already in the array
        const exists = myPokemon.some(p => p.name === pokemon.name);
        if (!exists) {
            myPokemon = [...myPokemon, pokemon];
        } else {
            console.warn(`Pokémon with the name '${pokemon.name}' already exists.`);
        }
    }

    /**
     * Retrieves all Pokémon from the repository.
     * Returns a copy of the Pokémon array to maintain immutability.
     * @return {Object[]} An array of all Pokémon objects in the repository.
     */
    function getAll() {
        return [...myPokemon];
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
        if (typeof pokemonName !== 'string') {
            console.error('pokemonName must be a string');
            return undefined;
        }
        return myPokemon.find(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase());
    }

    //Create fragment for more efficiently adding pokemon to pokedex
    let fragment = document.createDocumentFragment();

    /**
     * Adds a Pokémon item to a fragment.
     * The function creates a list item and a button for each Pokémon.
     * This button, when clicked, triggers the display of the Pokémon's details.
     * The created list item is appended to a document fragment for efficient DOM manipulation.
     * Actual appending to the DOM is done by `appendAllItems` function.
     * @param {Object} pokemon - A Pokémon object to add to the list.
     */
    function addListItem(pokemon) {
        let listItem = document.createElement('li');
        let button = document.createElement('button');

        button.classList.add('poke-button');
        button.textContent = pokemon.name; // Directly setting the text content
        button.setAttribute('aria-label', `View details for ${pokemon.name}`); // Accessibility improvement
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });

        listItem.appendChild(button);
        fragment.appendChild(listItem);
    }

    /**
     * Appends all items from the fragment to the main Pokémon list in the DOM.
     * This function is called after all Pokémon items have been added to the fragment,
     * allowing for efficient batched updates to the DOM.
     */
    function appendAllItems() {
        const pokemonList = document.querySelector('#pokemon-list');
        pokemonList.appendChild(fragment);
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
            .then(response => response.json())
            .then(json => {
                json.results.forEach(item => {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            })
            .catch(e => {
                console.error("Error loading Pokémon list:", e);
            });
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
    function loadDetails(pokemon) {
        if (detailedPokemon[pokemon.name]) {
            return Promise.resolve(detailedPokemon[pokemon.name]);
        }

        if (!pokemon.detailsUrl) {
            return Promise.reject(new Error('No details URL provided for the Pokémon.'));
        }

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
                };
                detailedPokemon[pokemon.name] = detailsObject;
                return detailsObject;
            })
            .catch(e => {
                console.error(`Error loading details for ${pokemon.name}:`, e);
            });
    }


    /**
     * Adds or updates details of a Pokémon object.
     *
     * This function takes a Pokémon object and a details object. It iterates over the keys
     * of the details object and adds or updates these keys in the Pokémon object with the
     * corresponding values from the details object.
     * 
     * @param {Object} pokemon - The Pokémon object to which the details will be added or updated.
     * @param {Object} detailsObject - An object containing key-value pairs to be added or updated in the Pokémon object.
     */
    function addDetails(pokemon, detailsObject) {
        Object.keys(detailsObject).forEach(function(key) {
            pokemon[key] = detailsObject[key];
        });
    }


    /**
     * Parses an evolutionary tree JSON to extract the names of all forms of a Pokémon.
     *
     * This function takes a JSON object representing a Pokémon's evolutionary tree and 
     * recursively traverses through it. At each step, it extracts the Pokémon's name 
     * from the 'species' key and adds it to an array. The function handles the tree's 
     * hierarchical structure by recursively processing each 'evolves_to' array.
     * 
     * @param {Object} evolutionaryTreeJson - A JSON object representing the evolutionary tree of a Pokémon.
     * @returns {string[]} An array containing the names of all forms of the Pokémon in its evolutionary tree.
     */
    function parseEvolutionaryTree(evolutionaryTreeJson) {
        let pokemonForms = [];

        /**
         * Recursively traverses an evolutionary step to collect Pokémon names.
         * @param {Object} evolutionaryStep - A step in the evolutionary tree.
         */
        function traverse(evolutionaryStep) {
            if (!evolutionaryStep) {
                console.error('Invalid evolutionary step encountered');
                return;
            }

            if (evolutionaryStep.species) {
                pokemonForms.push(evolutionaryStep.species.name);
            }

            if (evolutionaryStep.evolves_to && evolutionaryStep.evolves_to.length > 0) {
                evolutionaryStep.evolves_to.forEach(nextStep => traverse(nextStep));
            }
        }

        if (evolutionaryTreeJson && evolutionaryTreeJson.chain) {
            traverse(evolutionaryTreeJson.chain);
        } else {
            console.error('Invalid evolutionary tree JSON structure');
        }

        // Additional check for top-level traversal because the JSON the structure varies
        traverse(evolutionaryTreeJson);
        return pokemonForms;
    }

    /**
     * Retrieves the URL of the evolutionary tree for a given Pokémon.
     *
     * This function fetches the species details for the specified Pokémon from the API,
     * then extracts and returns the URL of the Pokémon's evolutionary chain.
     * 
     * @param {Object} pokemon - The Pokémon object for which to retrieve the evolutionary tree URL.
     * @returns {Promise<string>} A Promise that resolves with the URL of the evolutionary tree.
     */
    function getEvolutionaryTreeUrl(pokemon) {
        if (!pokemon.name) {
            return Promise.reject(new Error('Pokemon object does not have a name property'));
        }

        const pokemonName = pokemon.name;
        const evolutionaryTreeUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;

        return fetch(evolutionaryTreeUrl)
            .then(response => response.json())
            .then(speciesDetails => {
                const evolutionaryChainUrl = speciesDetails['evolution_chain']?.url;
                if (!evolutionaryChainUrl) {
                    throw new Error('Evolutionary chain URL not found in species details');
                }
                return evolutionaryChainUrl;
            })
            .catch(e => {
                console.error(`Error fetching evolutionary tree URL for ${pokemonName}:`, e);
                throw e; // Re-throw the error to ensure it's caught by the caller
            });
    }


    /**
     * Derives the evolutionary tree for a given Pokémon.
     *
     * This function first fetches the URL for the Pokémon's evolutionary tree,
     * then retrieves the tree data from that URL, and finally parses the tree
     * to extract the evolutionary forms of the Pokémon.
     * 
     * @param {Object} pokemon - The Pokémon object for which to derive the evolutionary tree.
     * @returns {Promise<string[]>} A Promise that resolves with an array of Pokémon names in the evolutionary tree.
     */
    function deriveEvolutionaryTree(pokemon) {
        if (!pokemon.name) {
            return Promise.reject(new Error('Pokemon object does not have a name property'));
        }

        return getEvolutionaryTreeUrl(pokemon)
            .then(evolutionaryChainUrl => fetch(evolutionaryChainUrl))
            .then(response => response.json())
            .then(json => parseEvolutionaryTree(json))
            .catch(error => {
                console.error(`Error in fetching evolutionary tree for ${pokemon.name}:`, error);
                throw error; // Re-throw to ensure propagation in promise chain
            });
    }


    /**
     * Determines the order of side images based on a Pokémon's position in its evolutionary array.
     * 
     * This function calculates which Pokémon images should be shown on the left and right sides
     * of the given Pokémon based on its position in the evolutionary array.
     * 
     * @param {Object} pokemon - The Pokémon object for which to determine the side images.
     * @param {string[]} evolutionArray - An array of Pokémon names in their evolutionary order.
     * @returns {Object} An object containing the names of the left and right Pokémon images.
     */
    function determineSideImageOrder(pokemon, evolutionArray) {
        if (!evolutionArray.includes(pokemon.name)) {
            throw new Error("The pokemon is not in the evolution array");
        }

        let imageOrder = {
            leftImage: null,
            rightImage: null
        };

        const position = evolutionArray.indexOf(pokemon.name);

        if (evolutionArray.length >= 3) {
            if (position === 0) {
                imageOrder.leftImage = evolutionArray[1];
                imageOrder.rightImage = evolutionArray[2];
            } else if (position === 1) {
                imageOrder.leftImage = evolutionArray[0];
                imageOrder.rightImage = evolutionArray[2];
            } else {
                imageOrder.leftImage = evolutionArray[0];
                imageOrder.rightImage = evolutionArray[1];
            }
        } else if (evolutionArray.length === 2) {
            if (position === 0) {
                imageOrder.rightImage = evolutionArray[1];
            } else {
                imageOrder.leftImage = evolutionArray[0];
            }
        }

        return imageOrder;
    };

    /**
     * Fetches a specific Pokémon by name from the API, adds it to the repository, and then to the DOM list.
     * @param {string} pokemonName - The name of the Pokémon to fetch and add.
     */
        function fetchAndAddPokemon(pokemonName) {
            let api = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
            return fetch(api)
                .then(response => response.json())
                .then(pokemon => {
                    let newPokemon = {
                        name: pokemon.name,
                        detailsUrl: api
                    };
                    add(newPokemon); // Add to the basic array
                    pokemonRepository.addListItem(newPokemon); // Add to the fragment

                    //Append all items in the fragment to the actual DOM
                    appendAllItems();

                    return newPokemon; // Return new pokemon for further processing
                })
                .catch(e => {
                    console.error(`Error fetching details for ${pokemonName}:`, e);
                });
        }


    /**
     * Ensures that detailed information for all Pokémon in a given Pokémon's evolutionary tree is available.
     * Fetches details for any Pokémon in the tree if they are not already loaded.
     * 
     * @param {Object} pokemon - A Pokémon object whose evolutionary tree details are to be ensured.
     * @returns {Promise<Object[]>} A promise that resolves with an array of detailed Pokémon objects.
     */
    function showEvolutionaryTreeDetails(pokemon) {
        let evolutionaryTree = detailedPokemon[pokemon.name].forms;

        let detailPromises = evolutionaryTree.map(name => {
            // Check if the detailed information is already available
            if (detailedPokemon[name]) {
                return Promise.resolve(detailedPokemon[name]);
            }

            // Check if the Pokémon is in the basic array but lacks detailed info
            let basicPokemon = pokemonRepository.findPokemonByName(name);
            if (basicPokemon) {
                return loadDetails(basicPokemon);
            }

            // If the Pokémon is not in either array, fetch and add it
            return fetchAndAddPokemon(name).then(newPokemon => loadDetails(newPokemon));
        });

        return Promise.all(detailPromises);
    }

    // declare modalElement variable
    let modalElement = null;

    function getModalElement () {
        if (!modalElement) {
            modalElement = document.querySelector(".box");
        }
        return modalElement;
    }

    /** 
     * This function hides the pokemon details modal with the class .box
     */
    function hidePokemonDetailsModal() {
        const modal = getModalElement();
        modal.style.visibility = "hidden";
    }

    /**
     * This function reveals the pokemon details in the modal UI
     * @param {*} pokemon - a pokemon object
     */
    function revealPokemonDetails(pokemon) {
        // Get document elements to be updated
        const pokeName = document.querySelector('.name > h4');
        const pokeHeightValue = document.querySelector('.values > .poke-height');
        const pokeWeightValue = document.querySelector('.values > .poke-weight');
        const pokeTypesValue = document.querySelector('.values > .poke-types');
        const cardBackgroundDiv = document.querySelector('.pokemon-card');
        const divForSprite = document.querySelector('.imgBx');
        const leftImageDiv = document.querySelector('.bg1')
        const rightImageDiv = document.querySelector('.bg2');

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
                    leftImageDiv.style.visibility = 'visible';
                    leftImageElement.setAttribute("src", leftImageUrl);
                    leftImageElement.setAttribute("alt", "Previous pokemon form");
                    leftImageDiv.appendChild(leftImageElement);
                } else {
                    leftImageDiv.style.visibility = 'hidden';
                }

                if (rightImageUrl != null) {
                    rightImageDiv.style.visibility = 'visible';
                    rightImageElement.setAttribute("src", rightImageUrl);
                    rightImageElement.setAttribute("alt", "Next pokemon evolutionary form");
                    rightImageDiv.appendChild(rightImageElement);
                } else {
                    rightImageDiv.style.visibility = 'hidden';
                }
            });

        } else {
            console.log("Attribute or Pokemon not found.");
        }
    }

    /**
     * logs pokemon name to the console
     * @param {*} pokemon - a pokemon object
     */
    function showDetails(pokemon) {

        // clear existing UI
        clearPokemonDetailsUI();

        const  modal = document.querySelector(".box")
        modal.style.visibility = "visible";

        const closeDetailsButton = document.querySelector(".close-details-button");
        closeDetailsButton.style.visibility = "visible";

        //focus on close button to make for easier closing
        closeButton = document.getElementById('close-button');
        closeButton.focus();

        loadDetails(pokemon)
            .then(() => revealPokemonDetails(pokemon));
    }

    /**
     * clears elements from the pokemonDetails modal UI
     */
    function clearPokemonDetailsUI (){
        // Get document elements to be cleared
        let pokeName = document.querySelector('.name > h4');
        let pokeHeightValue = document.querySelector('.values > .poke-height');
        let pokeWeightValue = document.querySelector('.values > .poke-weight');
        let pokeTypesValue = document.querySelector('.values > .poke-types');
        let cardBackgroundDiv = document.querySelector('.pokemon-card');
        let sprite = document.getElementById('pokemon_sprite');
        let sideImages = document.querySelectorAll('.bg > img')

        // clear text
        pokeName.innerText = '';
        pokeHeightValue.innerText = '';
        pokeWeightValue.innerText = '';
        pokeTypesValue.innerText = '';

        // clear background image
        cardBackgroundDiv.style.backgroundImage = '';

       // clear sprite if it exists
       if (sprite) {
        sprite.remove();
       }
        // remove side images if they exist
        if (sideImages != []) {
            sideImages.forEach(function(item) {
                item.remove();
            })
        }
        
    }

    /**
     * Function to hide the pokemonDetailsModal
     */
    function hideModal() {
        let modal = document.querySelector('.box');
        let modalChildren = document.querySelectorAll('.box > *');
        //get close button
        closeButton = document.getElementById('close-button');
        //hide model if close button is clicked
        modalChildren.forEach((child) => child.style.visibility = "");
        modal.style.visibility = "hidden";
        closeButton.style.visibility = "hidden";
    }

    //get close button
    closeButton = document.getElementById('close-button');
    //hide model if close button is clicked
    closeButton.addEventListener('click', () => {
        clearPokemonDetailsUI();
        hideModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearPokemonDetailsUI();
            hideModal();
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
        appendAllItems: appendAllItems
    };
})();

pokemonRepository.loadList().then(function() {
    // data loaded
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon)
    });
    pokemonRepository.appendAllItems();
});
