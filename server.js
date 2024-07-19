import express from "express"
import path from "path"
import { mlbData } from "./mlb.js"
const app = express()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static("public"))

app.get("/", async (req, res) => {
  const date = "07/19/2024"
  const dodgersTeamId = 119
  const angelsTeamId = 108
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&teamId=${dodgersTeamId}`
  const url2 = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&teamId=${angelsTeamId}`
  try {
    const [dodgersResponse, angelsResponse] = await Promise.all([
      fetch(url),
      fetch(url2),
    ])
    const dodgersData = await dodgersResponse.json()
    const angelsData = await angelsResponse.json()
    const extractGameData = (data) => {
      const game = data.dates[0]?.games[0]
      if (!game) return null

      return {
        officialDate: game.officialDate,
        homeTeamName: game.teams.home.team.name,
        homeTeamScore: game.teams.home.score,
        homeTeamWinner: game.teams.home.isWinner,
        awayTeamName: game.teams.away.team.name,
        awayTeamScore: game.teams.away.score,
        awayTeamWinner: game.teams.away.isWinner,
      }
    }

    const gameData = {
      dodgers: extractGameData(dodgersData),
      angels: extractGameData(angelsData),
    }
    if (
      (gameData.homeTeamName =
        "Los Angeles Dodgers" && gameData.dodgers.homeTeamWinner)
    ) {
      console.log("Free Panda Plate tomorrow!")
      //email subscribers the next day at 8am
    } else {
      return ""
    }

    if (
      //At any home game, if the Angels score 7 or more runs, everyone will receive a free Chick-fil-A® Chicken Sandwich!
      gameData.angels.homeTeamName &&
      gameData.angels.homeTeamScore >= 7
    ) {
      console.log("Free Chik sandiwhc")
      //email subscribers to open to Chik app, getting the free sandwich
    }

    res.json({
      dodgers: dodgersData,
      angel: angelsData,
    })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ error: "An error occurred while fetching the data" })
  }
})

app.get("/api/mlb-schedule", (req, res) => {
  const currentDate = new Date()
  const dodgersId = 119 // Dodgers team ID

  const pastHighScoringGames = []
  const futureHomeGames = []

  mlbData.dates.forEach((date) => {
    date.games.forEach((game) => {
      const gameDate = new Date(game.gameDate)
      const isDodgersHome = game.teams.home.team.id === dodgersId

      if (gameDate < currentDate) {
        // Past game
        if (isDodgersHome && game.teams.home.score >= 6) {
          pastHighScoringGames.push({ ...game, isDodgersHome: true })
        }
      } else if (isDodgersHome) {
        // Future home game
        futureHomeGames.push(game)
      }
    })
  })

  res.json({
    pastHighScoringGames,
    futureHomeGames,
  })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
