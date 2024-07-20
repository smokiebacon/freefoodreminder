import express from "express"
import path from "path"
import { fetchAndProcessMLBData, getCachedGameData } from "./mlbDataService.js"
const app = express()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static("public"))
fetchAndProcessMLBData()
app.get("/mlb-schedule", (req, res) => {
  const gameData = getCachedGameData()
  if (gameData) {
    console.log(gameData, "data")
    res.json(gameData)
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
