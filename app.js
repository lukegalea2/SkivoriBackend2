const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan"); // Logging middleware
const compression = require("compression"); // Compression middleware
const rateLimit = require("express-rate-limit"); // Rate limiting middleware

const { getStoredGames } = require("./data/games");
const { getSpin } = require("./data/spin");

const app = express();

// Middleware
app.use(morgan("dev")); // Logs incoming requests (can use 'combined' for detailed logging)
app.use(compression()); // GZIP compression for better performance
app.use(bodyParser.json({ limit: "1mb" })); // Limits request body size to 1mb for JSON payloads

// CORS headers (you already have this)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allows all origins (use specific domains for production)
  res.setHeader("Access-Control-Allow-Methods", "GET,POST"); // Allowed HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allowed headers
  next();
});

// Routes
app.get("/games", async (req, res) => {
  const storedGames = await getStoredGames();
  res.json({ games: storedGames });
});

app.get("/games/:search", async (req, res) => {
  const search = req.params.search;
  console.log("Search query:", search);

  const storedGames = await getStoredGames();

  const filteredGames = storedGames.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  res.json({ games: filteredGames });
});

// Spin route with rate limiter
app.get("/spin/:coins", async (req, res) => {
  let coins = parseInt(req.params.coins, 10); // Convert the parameter to a number
  if (isNaN(coins)) {
    return res.status(400).json({ error: "Invalid coins value" });
  }

  const spin = await getSpin(); // Get the spin result
  const spinResult = [spin.reel1, spin.reel2, spin.reel3];

  // Scoring rules
  const scoringRules = {
    "3_cherry": 50,
    "2_cherry": 40,
    "3_apple": 20,
    "2_apple": 10,
    "3_banana": 15,
    "2_banana": 5,
    "3_lemon": 3,
  };

  function calculateScore(spin) {
    if (spin[0] === spin[1] && spin[1] === spin[2]) {
      return scoringRules[`3_${spin[0]}`] || 0;
    }
    if (spin[0] === spin[1] || spin[1] === spin[2]) {
      return scoringRules[`2_${spin[0]}`] || scoringRules[`2_${spin[1]}`] || 0;
    }
    return 0;
  }

  const score = calculateScore(spinResult);
  coins = coins - 1 + score; // Decrease the coins by 1 and add score

  res.json({ result: spin, coins: coins, score: score }); // Return the spin result and updated coins
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
