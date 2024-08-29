document.addEventListener("DOMContentLoaded", () => {
  fetch("/todays-game")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!")
      }
      return response.json()
    })
    .then((data) => {
      toggleDodgerBadge(data)
      toggleAngelBadge(data)
      displayTodaysGameResults(data)
    })
    .catch((error) => console.error("Error:", error))
})

document.addEventListener("DOMContentLoaded", () => {
  fetch("/mlb-schedule")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!")
      }
      return response.json()
    })
    .then((data) => {
      displayPastDodgerGames(data.pastDodgerGamesWon)
      displayUpcomingDodgerGames(data.futureDodgerHomeGames)
      displayAngelsUpcomingGames(data.futureAngelHomeGames)
      displayAngelsPastWonHomeGames(data.pastAngelGamesWon)
    })
    .catch((error) => console.error("Error:", error))
})

document
  .getElementById("subscriptionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      console.log(data, "data")
      document.getElementById("message").textContent = data.message
      if (response.ok) {
        document.getElementById("email").value = ""
      }
    } catch (error) {
      console.error("Error:", error)
      document.getElementById("message").textContent =
        "An error occurred. Please try again."
    }
  })

const dodgerBadge = document.querySelector("#dodger-badge")
const angelBadge = document.querySelector("#angel-badge")

function displayTodaysGameResults(data) {
  const dodgerDiv = document.getElementById("dodgers-result")
  const angelsDiv = document.getElementById("angels-result")

  if (data) {
    const dodgersData = data.dodgers
    const angelsData = data.angels
    dodgerDiv.innerHTML = `
            <p class="col-lg-8 mx-auto fs-5 text-muted">Game Date: ${dodgersData.officialDate}</p>
            <p>Home Team: ${dodgersData.homeTeamName}</p>
            <p>Home Team Score: ${dodgersData.homeTeamScore}</p>
            <p>Home Team Winner: ${dodgersData.homeTeamWinner}</p>
            <p>Away Team: ${dodgersData.awayTeamName}</p>
            <p>Away Team Score: ${dodgersData.awayTeamScore}</>
        `
    angelsDiv.innerHTML = `
      <p class="col-lg-8 mx-auto fs-5 text-muted">Game Date: ${angelsData.officialDate}</p>
      <p>Home Team: ${angelsData.homeTeamName}</p>
      <p>Home Team Score: ${angelsData.homeTeamScore}</p>
      <p>Home Team Winner: ${angelsData.homeTeamWinner}</p>
      <p>Away Team: ${angelsData.awayTeamName}</p>
      <p>Away Team Score: ${angelsData.awayTeamScore}</>
  `
  } else {
    console.log("No Game")
  }
}

function toggleDodgerBadge(data) {
  if (dodgerBadge) {
    //make sure badge is ACTIVE the day AFTER Dodgers win
    let dodgerOfficialDate = data.dodgers.officialDate
    let todaysDate = new Date().toISOString().split("T")[0]
    let date = new Date(todaysDate)
    date.setDate(date.getDate() - 1)
    let yesterdaysDate = date.toISOString().split("T")[0]

    if (
      data.dodgers &&
      data.dodgers.homeTeamName == "Los Angeles Dodgers" &&
      data.dodgers.homeTeamWinner === true &&
      yesterdaysDate === dodgerOfficialDate
    ) {
      dodgerBadge.innerHTML = "ACTIVE"
      dodgerBadge.classList.add("text-bg-success")
    } else {
      dodgerBadge.innerHTML = "Not Active"
      dodgerBadge.classList.add("text-bg-danger")
    }
  }
}

function toggleAngelBadge(data) {
  if (angelBadge) {
    if (
      data.angels &&
      data.angels.homeTeamName === "Los Angeles Angels" &&
      data.angels.homeTeamScore >= 7
    ) {
      angelBadge.innerHTML = "ACTIVE"
      angelBadge.classList.remove("text-bg-danger")
      angelBadge.classList.add("text-bg-success")
    } else {
      angelBadge.innerHTML = "Not Active"
      angelBadge.classList.remove("text-bg-success")
      angelBadge.classList.add("text-bg-danger")
    }
  }
}

function displayPastDodgerGames(games) {
  const pastDodgerGameWinsTable = document.getElementById("dodgers-past-games")
  games.forEach((game) => {
    const row = document.createElement("tr")
    row.innerHTML = `
              <td>${new Date(game.gameDate).toLocaleString()}</td>
              <td>${game.teams.away.team.name}</td>
              <td>${game.teams.home.score} - ${game.teams.away.score}</td>
              <td>${game.venue.name}</td>
              <td>${game.status.detailedState}</td>
          `
    pastDodgerGameWinsTable.appendChild(row)
  })
}

function displayAngelsPastWonHomeGames(games) {
  const pastAngelsGameWinsTable = document.getElementById("angels-past-games")
  if (games.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
    <td>Angels have not won any Home game with a score of 7 or more yet.</td>
`
    pastAngelsGameWinsTable.appendChild(row)
  }
  games.forEach((game) => {
    const row = document.createElement("tr")
    row.innerHTML = `
              <td>${new Date(game.gameDate).toLocaleString()}</td>
              <td>${game.teams.away.team.name}</td>
              <td>${game.teams.home.score} - ${game.teams.away.score}</td>
              <td>${game.venue.name}</td>
              <td>${game.status.detailedState}</td>
          `
    pastAngelsGameWinsTable.appendChild(row)
  })
}
function displayUpcomingDodgerGames(games) {
  if (!games) return
  const upcomingGamesTable = document.getElementById("upcomingGames")
  if (games.length === 0) {
    const displayNoGamesRow = document.createElement("div")
    displayNoGamesRow.innerHTML = "No Upcoming Games"
    upcomingGamesTable.appendChild(displayNoGamesRow)
  }
  games.forEach((game) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${new Date(game.gameDate).toLocaleString()}</td>
            <td>${game.teams.away.team.name}</td>
            <td>${game.venue.name}</td>
            <td>${game.status.detailedState}</td>
        `
    upcomingGamesTable.appendChild(row)
  })
}

function displayAngelsUpcomingGames(games) {
  const upcomingAngelsGamesTable = document.getElementById(
    "angels-upcoming-games"
  )
  games.forEach((game) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${new Date(game.gameDate).toLocaleString()}</td>
            <td>${game.teams.away.team.name}</td>
            <td>${game.venue.name}</td>
            <td>${game.status.detailedState}</td>
        `
    upcomingAngelsGamesTable.appendChild(row)
  })
}
