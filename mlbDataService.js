import fetch from "node-fetch"
import { sendWinnerEmails } from "./sendEmail.js"
import { todaysDate } from "./date.js"

let cachedGameData = null

export async function fetchAndProcessMLBData() {
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

    cachedGameData = gameData

    // Handle email sending here
    if (gameData.dodgers && gameData.dodgers.homeTeamWinner === true) {
      try {
        await sendWinnerEmails(gameData.dodgers)
        console.log("Email sent successfully")
      } catch (error) {
        console.error("Failed to send email:", error)
      }
    }

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
