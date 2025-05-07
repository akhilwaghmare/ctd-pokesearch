import { Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { getPokemon } from "../db/query";
import Footer from "./Footer";

// Optimization configs
const OPTIMIZATION_CONFIG = {
  initial_cache: false,
  debounce: false,
};

const CACHE = {
  pokemon: null,
};

const PokemonExplorer = () => {
  const [displayPokemon, setDisplayPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");

  const [fetchFuncCount, setFetchFuncCount] = useState(0);
  const [fetchReqCount, setFetchReqCount] = useState(0);

  const fetchPokemon = async () => {
    setFetchFuncCount((prev) => prev + 1);

    if (OPTIMIZATION_CONFIG["initial_cache"]) {
      if (CACHE["pokemon"]) {
        return CACHE["pokemon"];
      }
    }

    try {
      const { data: pokemonData, numReq } = await getPokemon();
      CACHE["pokemon"] = pokemonData;
      setFetchReqCount((prev) => prev + numReq);
      return pokemonData;
    } catch {
      setError("Failed to fetch Pokemon data. Please try again later.");
    }
  };

  useEffect(() => {
    const initialDataLoad = async () => {
      setLoading(true);
      const pokeData = await fetchPokemon();
      setDisplayPokemon(pokeData);
      setLoading(false);
    };

    initialDataLoad();
  }, []);

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        let results = await fetchPokemon();

        // Filter based on search term
        if (searchTerm) {
          results = results.filter(
            (p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.id.toString().includes(searchTerm)
          );
        }

        // Sort based on selected option
        if (sortBy === "id") {
          results.sort((a, b) => a.id - b.id);
        } else if (sortBy === "name") {
          results.sort((a, b) => a.name.localeCompare(b.name));
        }

        setDisplayPokemon(results);
      } catch (err) {
        console.error("Error fetching or processing Pokemon:", err);
      }
    };

    if (OPTIMIZATION_CONFIG["debounce"]) {
      const debounce = setTimeout(() => {
        fetchAndFilter();
      }, 500);

      return () => clearTimeout(debounce);
    }

    fetchAndFilter();
  }, [searchTerm, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const MemoGrid = useMemo(() => {
    return <PokemonGrid pokemon={displayPokemon} />;
  }, [displayPokemon]);

  const MemoFooter = useMemo(() => {
    return <Footer />;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-100 p-6 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center text-red-600">
          Pokémon Explorer
        </h1>

        <div className="px-4 py-2 border border-gray-300 rounded shadow-sm flex items-center gap-4">
          <h3 className="font-semibold">Optimization stats</h3>
          <p className="text-sm">Fetch function count: {fetchFuncCount}</p>
          <p className="text-sm">Fetch request count: {fetchReqCount}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name or Pokedex number..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full md:w-auto p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            <option value="id">Sort by Pokedex Number</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      <PokemonGrid pokemon={displayPokemon} />
      <Footer />

      {/* {MemoGrid} */}
      {/* {MemoFooter} */}
    </div>
  );
};

const PokemonGrid = ({ pokemon }) => {
  return (
    <>
      {pokemon.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">No Pokémon found match search</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="bg-gray-100 p-4 flex justify-center">
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="h-24 w-24 object-contain"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-sm">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
                <h2 className="font-bold text-lg">{pokemon.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PokemonExplorer;
