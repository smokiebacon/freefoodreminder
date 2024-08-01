import fetch from "node-fetch"
import { sendWinnerEmails } from "./sendEmail.js"
import { todaysDate, dodgersDateMinusOne, getMonthBoundaries } from "./date.js"

let cachedGameData = null
let allGameData = null

//route is mlb-schedule
export async function fetchDodgerAndAngelsSchedule() {
  let dodgersTeamId = 119
  let angelsTeamId = 108
  const resultDate = getMonthBoundaries()

  let dodgersURL = `https://statsapi.mlb.com/api/v1/schedule?hydrate=team,lineups&sportId=1&startDate=${resultDate.firstDay}&endDate=${resultDate.lastDay}&teamId=${dodgersTeamId}`
  let angelsURL = `https://statsapi.mlb.com/api/v1/schedule?hydrate=team,lineups&sportId=1&startDate=${resultDate.firstDay}&endDate=${resultDate.lastDay}&teamId=${angelsTeamId}`

  try {
    const currentDate = new Date()
    const [dodgersResponse, angelsResponse] = await Promise.all([
      fetch(dodgersURL),
      fetch(angelsURL),
    ])
    const dodgersData = await dodgersResponse.json()
    const angelsData = await angelsResponse.json()
    const pastDodgersWinsGames = []
    const futureDodgerHomeGames = []
    const pastAngelWinsGames = []
    const futureAngelHomeGames = []
    dodgersData.dates.forEach((date) => {
      date.games.forEach((game) => {
        const gameDate = new Date(game.gameDate)
        const isDodgersHome = game.teams.home.team.id === dodgersTeamId
        const isDodgersHomeWin = game.teams.home.isWinner

        if (gameDate < currentDate) {
          // Past game
          if (isDodgersHome && isDodgersHomeWin) {
            pastDodgersWinsGames.push({ ...game, isDodgersHome: true })
          }
        } else if (isDodgersHome) {
          // Future home game
          futureDodgerHomeGames.push(game)
        }
      })
    })

    angelsData.dates.forEach((date) => {
      date.games.forEach((game) => {
        const gameDate = new Date(game.gameDate)
        const isAngelHome = game.teams.home.team.id === angelsTeamId
        const isAngelHomeWin = game.teams.home.isWinner

        if (gameDate < currentDate) {
          // Past game
          if (angelsTeamId && isAngelHomeWin) {
            pastAngelWinsGames.push({ ...game, isAngelsHome: true })
          }
        } else if (isAngelHome) {
          // Future home game
          futureAngelHomeGames.push(game)
        }
      })
    })

    const newData = {
      pastDodgerGamesWon: pastDodgersWinsGames,
      futureDodgerHomeGames: futureDodgerHomeGames,
      pastAngelGamesWon: pastAngelWinsGames,
      futureAngelHomeGames: futureAngelHomeGames,
    }

    allGameData = newData
  } catch (error) {
    console.error("Failed", error)
  }
}

//route is todays-game
export async function fetchAndProcessMLBData() {
  const date = todaysDate()
  const dodgersDate = dodgersDateMinusOne()
  let dodgersTeamId = 119
  let angelsTeamId = 108
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
      if (!data) return null
      const game = data.dates[0]?.games[0]
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

export function getDodgerAndAngelsCachedGamesData() {
  return allGameData
}
export function getCachedGameData() {
  return cachedGameData
}
