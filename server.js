import express from "express"
import path from "path"
import {
  fetchAndProcessMLBData,
  getCachedGameData,
  getDodgersCachedGameData,
  fetchDodgerSchedule,
} from "./mlbDataService.js"
const app = express()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static("public"))
fetchAndProcessMLBData()
fetchDodgerSchedule()
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
  console.log(dodgersCachedData, "dodgersCachedData")

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
