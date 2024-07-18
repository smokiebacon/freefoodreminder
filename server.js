import express from "express"
import fetch from "node-fetch" // Use import instead of require
import bodyParser from "body-parser"
import ServerlessHttp from "serverless-http"
import { mlbData } from "./mlb.js"

const app = express()
app.use(bodyParser.json())
const port = 3000

function todaysDate() {
  var today = new Date()
  var dd = today.getDate() - 4
  var mm = today.getMonth() + 1
  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = "0" + dd
  }
  if (mm < 10) {
    mm = "0" + mm
  }
  today = mm + "/" + dd + "/" + yyyy
  return today
}

app.get("/api/mlb-schedule", async (req, res) => {
  const date = todaysDate()
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
      (gameData.angels.homeTeamName || gameData.angels.awayTeamName) &&
      (gameData.angels.homeTeamScore >= 6 || gameData.angels.awayTeamScore >= 6)
    ) {
      console.log("Free Chik sandiwhc")
      //email subscribers to open to Chik app, getting the free sandwich
    }

    console.log(gameData, "data")
    res.json({
      dodgers: dodgersData,
      angel: angelsData,
    })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ error: "An error occurred while fetching the data" })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// This is the JSON data you provided
app.get("/", (req, res) => {
  const currentDate = new Date()
  const dodgersId = 119 // Dodgers team ID

  const pastHomeWins = []
  const futureHomeGames = []

  mlbData.dates.forEach((date) => {
    date.games.forEach((game) => {
      const gameDate = new Date(game.gameDate)
      const isDodgersHome = game.teams.home.team.id === dodgersId
      const isDodgersAway = game.teams.away.team.id === dodgersId

      if (isDodgersHome) {
        if (gameDate < currentDate) {
          // Past game
          if (isDodgersHome && game.teams.home.score >= 6) {
            pastHomeWins.push({ ...game, isDodgersHome: true })
          }
        } else {
          // Future game
          futureHomeGames.push(game)
        }
      }
    })
  })

  const pastWinsHtml = pastHomeWins
    .map(
      (game) => `
    <div class="col-md-6 mb-4">
      <div class="p-4 bg-body-tertiary rounded-3 h-100">
        <h2 class="text-body-emphasis">Dodgers Win: ${
          game.teams.away.team.name
        } @ Dodgers</h2>
        <p>Date: ${new Date(game.gameDate).toLocaleString()}</p>
        <p>Score: Dodgers ${game.teams.home.score} - ${game.teams.away.score} ${
        game.teams.away.team.name
      }</p>
      </div>
    </div>
  `
    )
    .join("")

  const futureGamesHtml = futureHomeGames
    .map(
      (game) => `
    <div class="col-md-6 mb-4">
      <div class="p-4 bg-body-tertiary rounded-3 h-100">
        <h2 class="text-body-emphasis">Upcoming: ${
          game.teams.away.team.name
        } @ Dodgers</h2>
        <p>Date: ${new Date(game.gameDate).toLocaleString()}</p>
        <p>Venue: ${game.venue.name}</p>
        <p>Status: ${game.status.detailedState}</p>
      </div>
    </div>
  `
    )
    .join("")

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dodgers Home Games</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container my-5">
            <h1 class="text-center mb-4">Dodgers Home Games</h1>
            <h2 class="mt-5">Past Home Wins</h2>
            <div class="row">
                ${pastWinsHtml}
            </div>
            <h2 class="mt-5">Upcoming Home Games</h2>
            <div class="row">
                ${futureGamesHtml}
            </div>
        </div>
    </body>
    </html>
  `)
})

// module.exports.hander = ServerlessHttp(app)
