export const getPokemon = async () => {
  let numReq = 0;

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=300");
    numReq++;
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        numReq++;
        return await detailResponse.json();
      })
    );

    const formattedPokemon = pokemonDetails.map((p) => ({
      id: p.id,
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      sprite: p.sprites.front_default,
    }));

    return {
      data: formattedPokemon,
      numReq,
    };
  } catch (err) {
    console.log("Error with fetch: ", err.message);
    throw err;
  }
};
