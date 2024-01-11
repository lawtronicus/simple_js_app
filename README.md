# Simple_JS_Project

Simple_JS_Project is a web application that provides an interactive way to browse and learn about different Pokémon. Utilizing the Pokémon API, this app displays information about various Pokémon, including their stats, types, and images.

## Features

- Browse a list of Pokémon with names and images.
- View detailed information about each Pokémon, including height, weight, types, and base stats.
- Interactive UI with modals to display Pokémon details.
- Responsive design using Bootstrap.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap
- Pokémon API

## Setup

To run this project locally:

1. Clone the repository to your local machine.
2. Open the `index.html` file in a modern web browser.
3. Explore the list of Pokémon and click on any to view detailed information.

## Functionality Overview

The Simple_JS_Project uses a JavaScript IIFE (Immediately Invoked Function Expression) to encapsulate the functionality. The following are some of the main functionalities available:

### Adding a New Pokémon

To add a new Pokémon to the repository, use the `add` method. This method takes an object representing the Pokémon as a parameter:

```javascript
myPokedex.add({
  name: "Pikachu",
  height: 1.04,
  weight: 13.2
  // Additional details
})
```

### Viewing All Pokémon

To retrieve all Pokémon stored in the repository, use the `getAll` method. This method returns an array of all Pokémon objects:

```
const allPokemon = myPokedex.getAll();
console.log(allPokemon);

```

### Finding a Pokémon by Name

To find a Pokémon by its name, use the `findPokemonByName` method. This method returns the Pokémon object if found, or undefined if not:

```
const foundPokemon = myPokedex.findPokemonByName('Pikachu');
console.log(foundPokemon);
```

### Loading Pokémon List

To load the list of Pokémon from the API, use the `loadList` method. This method fetches data from the Pokémon API and populates the repository:

```
myPokedex.loadList().then(() => {
    // Pokémon list loaded
});
```

### Loading Pokémon Details

To load detailed information for a specific Pokémon, use the `loadDetails` method:

```
myPokedex.loadDetails(pokemon).then(details => {
    // Detailed information loaded
});
```

## Future Enhancements

- Implement search functionality to find Pokémon by name.
- Add sorting features to organize Pokémon based on different criteria.
- Enhance the UI/UX with animations and transitions.

## Contributions

This project is currently not open for contributions but feedback and suggestions are always welcome.
