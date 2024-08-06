import express from "express"
import path from "path"
import { getMonthBoundaries } from "./date.js"
import { connectDB } from "./database.js"
import {
  fetchAndProcessMLBData,
  getCachedGameData,
  getDodgerAndAngelsCachedGamesData,
  fetchDodgerAndAngelsSchedule,
} from "./mlbDataService.js"
const app = express()
connectDB()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static("public"))
fetchAndProcessMLBData()
fetchDodgerAndAngelsSchedule()

app.get("/todays-game", (req, res) => {
  const gameData = getCachedGameData()
  if (gameData) {
    res.json(gameData)
  } else {
    res.status(503).json({ error: "Data nost available yet" })
  }
})

app.get("/mlb-schedule", (req, res) => {
  const cachedGamesData = getDodgerAndAngelsCachedGamesData()

  if (cachedGamesData) {
    res.json(cachedGamesData)
  } else {
    res.status(503).json({ error: "Data nost available yet" })
  }
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
