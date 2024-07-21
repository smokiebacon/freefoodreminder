import fetch from "node-fetch"
import { sendWinnerEmails } from "./sendEmail.js"
import { todaysDate, dodgersDateMinusOne } from "./date.js"

let cachedGameData = null
let dodgersGameDataDateRange = null
export async function fetchDodgerSchedule() {
  const url =
    "https://statsapi.mlb.com/api/v1/schedule?hydrate=team,lineups&sportId=1&startDate=2024-07-01&endDate=2024-07-31&teamId=119"

  try {
    const currentDate = new Date()
    const dodgersId = 119 // Dodgers team ID
    const pastHighScoringGames = []
    const futureHomeGames = []
    const dodgersResponse = await fetch(url)
    const dodgersData = await dodgersResponse.json()
    dodgersData.dates.forEach((date) => {
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

    const newDodgersData = {
      pastDodgerGamesWonWith6Plus: pastHighScoringGames,
      futureHomeGames: futureHomeGames,
    }
    dodgersGameDataDateRange = newDodgersData
  } catch (error) {
    console.error("Failed", error)
  }
}

export async function fetchAndProcessMLBData() {
  const date = todaysDate()
  const dodgersDate = dodgersDateMinusOne()
  const dodgersTeamId = 119
  const angelsTeamId = 108
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${dodgersDate}&teamId=${dodgersTeamId}`
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

    cachedGameData = gameData

    // // Handle email sending here
    // if (gameData.dodgers && gameData.dodgers.homeTeamWinner === true) {
    //   try {
    //     await sendWinnerEmails(gameData.dodgers)
    //     console.log("Email sent successfully")
    //   } catch (error) {
    //     console.error("Failed to send email:", error)
    //   }
    // }

    // Handle Chick-fil-A promotion
    if (
      gameData.angels &&
      gameData.angels.homeTeamName &&
      gameData.angels.homeTeamScore >= 7
    ) {
      console.log("Free Chick-fil-A sandwich")
      // Implement logic to notify subscribers
    }
  } catch (error) {
    console.error("Error fetching MLB data:", error)
  }
}

export function getCachedGameData() {
  return cachedGameData
}

export function getDodgersCachedGameData() {
  return dodgersGameDataDateRange
}
