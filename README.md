# Pokemon Repository

## Description

This project is a JavaScript-based application for managing a collection of Pokémon. It allows users to add new Pokémon to the repository and retrieve information about existing Pokémon. The application is designed with functional programming principles in mind, emphasizing immutability, pure functions, and avoiding shared state.

## Features

- Add new Pokémon to the repository.
- Retrieve a list of all Pokémon in the repository.
- Determine if each Pokémon is "big" based on its height.
- Display information about each Pokémon on the webpage.

## How to Use

### Setup

To get started with this project, clone the repository to your local machine:

`git clone https://github.com/your-username/pokemon-repository.git`

Navigate to the project directory:

`cd pokemon-repository`


Open the `index.html` file in a web browser to view the project.

## Adding a New Pokémon

To add a new Pokémon to the repository, use the `add` method:

    javascript
        pokemonRepository.add({
            name: 'Pikachu',
            height: 1.04,
            weight: 13.2,
            category: 'Mouse',
            types: ['electric']
        });

## Viewing all Pokémon

To view all Pokémon in the repository, use the `getAll` method

    const allPokemon = pokemonRepository.getAll();
    console.log(allPokemon);

## Contributing

While this project is primarily a personal practice project, anyone interested in the code or the approach is free to fork it and experiment on their own. Please note that this is a solo project for learning purposes, and as such, I am not looking to accept pull requests or collaborate directly on this repository. Feel free to use it as a reference or for inspiration in your own projects!
