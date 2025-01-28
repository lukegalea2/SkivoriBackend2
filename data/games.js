const fs = require("node:fs/promises");

async function getStoredGames() {
  const rawFileContent = await fs.readFile("game-data.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedGames = data ?? [];
  return storedGames;
}

exports.getStoredGames = getStoredGames;
