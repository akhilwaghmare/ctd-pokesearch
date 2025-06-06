import React from "react";

const Footer = () => {
  const heavyComputation = (num) => {
    console.log("Running heavy computation...");
    let count = 0;
    for (let i = 0; i < 1e7; i++) {
      count += i % num;
    }
    return count;
  };
  heavyComputation(2);

  return (
    <footer className="mt-8 text-center text-gray-500 text-sm">
      <p>
        Data provided by{" "}
        <a
          href="https://pokeapi.co/"
          className="text-red-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          PokéAPI
        </a>
      </p>
      <p className="mt-1">Created with React and Vite</p>
    </footer>
  );
};

export default Footer;
