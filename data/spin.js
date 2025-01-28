const fs = require("node:fs/promises");

const reel1 = [
  "cherry",
  "lemon",
  "apple",
  "lemon",
  "banana",
  "banana",
  "lemon",
  "lemon",
];
const reel2 = [
  "lemon",
  "apple",
  "lemon",
  "lemon",
  "cherry",
  "apple",
  "banana",
  "lemon",
];
const reel3 = [
  "lemon",
  "apple",
  "lemon",
  "apple",
  "cherry",
  "lemon",
  "banana",
  "lemon",
];

async function getSpin() {
  // Helper function to get a random element from an array
  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  // Get one random string from each array
  const spinResult = {
    reel1: getRandomElement(reel1),
    reel2: getRandomElement(reel2),
    reel3: getRandomElement(reel3),
  };

  // Return the result
  return spinResult;
}

exports.getSpin = getSpin;
