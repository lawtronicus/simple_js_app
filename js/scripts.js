// declare variables

const pokemonList = [
    {
        name: 'Bulbasur',
        height: 2.04,
        weight: 15.2,
        category: "Seed",
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
    }
];

//Write name and height to document, as well as a note on its bigness

// begin looping through pokemonList
for (let i=0; i < pokemonList.length; i++) {

    //set variable to '(Wow! That's big!)' if height is greater than 2, and an empty string if not
    let isItBig = pokemonList[i].height > 2 ? "(Wow! That's big!)" : "";

    //write result to document along with a break for readability
    document.write(`${pokemonList[i].name} - height: ${pokemonList[i].height} ${isItBig} <br>`);
};