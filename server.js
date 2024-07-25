import express from "express"
import path from "path"
import { getMonthBoundaries } from "./date.js"
import {
  fetchAndProcessMLBData,
  getCachedGameData,
  getDodgersCachedGameData,
  fetchDodgerSchedule,
  fetchDodgersAndAngelsMonthSchedule,
} from "./mlbDataService.js"
const app = express()
const port = 3000
let dodgersTeamId = 119
let angelsTeamId = 108

// Serve static files from the 'public' directory
app.use(express.static("public"))
fetchAndProcessMLBData()
fetchDodgerSchedule()
fetchDodgersAndAngelsMonthSchedule()

app.get("/todays-game", (req, res) => {
  const gameData = getCachedGameData()
  if (gameData) {
    res.json(gameData)
  } else {
    res.status(503).json({ error: "Data nost available yet" })
  }
})

app.get("/mlb-schedule", (req, res) => {
  const dodgersCachedData = getDodgersCachedGameData()

  if (dodgersCachedData) {
    res.json(dodgersCachedData)
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
