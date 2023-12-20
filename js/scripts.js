// create protected pokemon object that cannot be modified

const basePokemonList = (function() {
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
    return myPokemon 
})();

/**
 * Adds a 'isBig' property to each pokemon in the array based on their height.
 * @param {Object[]} pokemonArray - Array of pokemon objects.
 * @return {Object[]} New array of pokemon objects with 'isBig' property added.
 */

function addBignessProperty(pokemonArray) {
    return pokemonArray.map(pokemon => {
        return {
            ...pokemon,
            isBig: pokemon.height > 2
        };
    });
 };

/**
 * Writes information about each pokemon to the document, including a special note if the pokemon is big.
 * @param {Object[]} pokemonArray - Array of pokemon objects with 'isBig' property.
 */

function writePokemonListToDoc(pokemonArray) {
    pokemonArray.forEach(pokemon => {
        const message = pokemon.isBig
            ? `${pokemon.name} - height: ${pokemon.height} - Wow! That's big! <br>`
            : `${pokemon.name} - height: ${pokemon.height}<br>`;
        document.write(message);
    });
};

writePokemonListToDoc(addBignessProperty(basePokemonList));
