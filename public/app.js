document.addEventListener("DOMContentLoaded", () => {
  fetch("/todays-game")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data, "data");
      console.log(Intl.DateTimeFormat().resolvedOptions().timeZone, "timezone");
      toggleDodgerBadge(data);
      toggleAngelBadge(data);
      displayTodaysGameResults(data);
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/mlb-schedule")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      return response.json();
    })
    .then((data) => {
      displayPastDodgerGames(data.pastDodgerGamesWon);
      displayUpcomingDodgerGames(data.futureDodgerHomeGames);
      displayAngelsUpcomingGames(data.futureAngelHomeGames);
      displayAngelsPastWonHomeGames(data.pastAngelGamesWon);
    })
    .catch((error) => console.error("Error:", error));
});

document
  .getElementById("subscriptionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data, "data");
      document.getElementById("message").textContent = data.message;
      if (response.ok) {
        document.getElementById("email").value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").textContent =
        "An error occurred. Please try again.";
    }
  });

const dodgerBadge = document.querySelector("#dodger-badge");
const angelBadge = document.querySelector("#angel-badge");

function displayTodaysGameResults(data) {
  const dodgerDiv = document.getElementById("dodgers-result");
  const angelsDiv = document.getElementById("angels-result");

  if (data) {
    const dodgersData = data.dodgers;
    const angelsData = data.angels;
    console.log(dodgersData.homeTeamName);
    dodgerDiv.innerHTML =
      dodgersData && typeof dodgersData === "object"
        ? `
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title text-muted mb-3">${
                  dodgersData.officialDate
                }</h5>
                <div class="row align-items-center">
                  <div class="col">
                    <p>Home Team:</p>
                    <h6 class="mb-0">${dodgersData.homeTeamName}</h6>
                    <h3 class="display-4 fw-bold">${
                      dodgersData.homeTeamScore
                    }</h3>
                  </div>
                  <div class="col-auto">
                    <h4 class="mb-0">VS</h4>
                  </div>
                  <div class="col">
                    <p>Away Team:</p>
                    <h6 class="mb-0">${dodgersData.awayTeamName}</h6>
                    <h3 class="display-4 fw-bold">${
                      dodgersData.awayTeamScore
                    }</h3>
                  </div>
                </div>
                <p>at ${dodgersData.venue}</p>

                <div class="mt-3">
                  <span class="badge ${
                    dodgersData.homeTeamWinner ? "bg-success" : "bg-danger"
                  }">
                    ${dodgersData.homeTeamWinner ? "Winner" : "Lost"}
                  </span>
              </div>
            </div>`
        : `<div class="alert alert-info">No Game Today</div>`;

    angelsDiv.innerHTML =
      angelsData && typeof angelsData === "object"
        ? `
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title text-muted mb-3">${
                  angelsData.officialDate
                }</h5>
                <div class="row align-items-center">
                  <div class="col">
                    <p>Home Team:</p>
                    <h6 class="mb-0">${angelsData.homeTeamName}</h6>
                    <h3 class="display-4 fw-bold">${
                      angelsData.homeTeamScore
                    }</h3>
                  </div>
                  <div class="col-auto">
                    <h4 class="mb-0">VS</h4>
                  </div>
                  <div class="col">
                    <p>Away Team:</p>
                    <h6 class="mb-0">${angelsData.awayTeamName}</h6>
                    <h3 class="display-4 fw-bold">${
                      angelsData.awayTeamScore
                    }</h3>
                  </div>
                </div>
                <p>at ${angelsData.venue}</p>
                <div class="mt-3">
                  <span class="badge ${
                    angelsData.homeTeamWinner !== undefined
                      ? angelsData.homeTeamWinner
                        ? "bg-success"
                        : "bg-danger"
                      : ""
                  }">
                    ${
                      angelsData.homeTeamWinner !== undefined
                        ? angelsData.homeTeamWinner
                          ? "Winner"
                          : "Lost"
                        : ""
                    }
                  </span>
                  ${
                    angelsData.homeTeamWinner === undefined
                      ? '<button class="btn btn-warning" id="live-game-button">Game is Live!</button>'
                      : ""
                  }
                </div>
              </div>
            </div>`
        : `<div class="alert alert-info">No Game Today</div>`;
  } else {
    dodgerDiv.innerHTML = `<div class="alert alert-info">No Game Today</div>`;
    angelsDiv.innerHTML = `<div class="alert alert-info">No Game Today</div>`;
  }
}

function toggleDodgerBadge(data) {
  if (dodgerBadge) {
    //make sure badge is ACTIVE the day AFTER Dodgers win
    let dodgerOfficialDate = data.dodgers.officialDate;
    let todaysDate = new Date().toISOString().split("T")[0];
    let date = new Date(todaysDate);
    date.setDate(date.getDate() - 1);
    let yesterdaysDate = date.toISOString().split("T")[0];

    if (
      data.dodgers &&
      data.dodgers.homeTeamName == "Los Angeles Dodgers" &&
      data.dodgers.homeTeamWinner === true &&
      yesterdaysDate === dodgerOfficialDate
    ) {
      dodgerBadge.innerHTML = "ACTIVE";
      dodgerBadge.classList.add("text-bg-success");
    } else {
      dodgerBadge.innerHTML = "Not Active";
      dodgerBadge.classList.add("text-bg-danger");
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
      angelBadge.innerHTML = "ACTIVE";
      angelBadge.classList.remove("text-bg-danger");
      angelBadge.classList.add("text-bg-success");
    } else {
      angelBadge.innerHTML = "Not Active";
      angelBadge.classList.remove("text-bg-success");
      angelBadge.classList.add("text-bg-danger");
    }
  }
}

function displayPastDodgerGames(games) {
  const pastDodgerGameWinsTable = document.getElementById("dodgers-past-games");
  games.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${new Date(game.gameDate).toLocaleString()}</td>
              <td>${game.teams.away.team.name}</td>
              <td>${game.teams.home.score} - ${game.teams.away.score}</td>
              <td>${game.venue.name}</td>
              <td>${game.status.detailedState}</td>
          `;
    pastDodgerGameWinsTable.appendChild(row);
  });
}

function displayAngelsPastWonHomeGames(games) {
  const pastAngelsGameWinsTable = document.getElementById("angels-past-games");
  if (games.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>Angels have not won any Home game with a score of 7 or more yet.</td>
`;
    pastAngelsGameWinsTable.appendChild(row);
  }
  games.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${new Date(game.gameDate).toLocaleString()}</td>
              <td>${game.teams.away.team.name}</td>
              <td>${game.teams.home.score} - ${game.teams.away.score}</td>
              <td>${game.venue.name}</td>
              <td>${game.status.detailedState}</td>
          `;
    pastAngelsGameWinsTable.appendChild(row);
  });
}
function displayUpcomingDodgerGames(games) {
  if (!games) return;
  const upcomingGamesTable = document.getElementById("upcomingGames");
  if (games.length === 0) {
    const displayNoGamesRow = document.createElement("div");
    displayNoGamesRow.innerHTML = "No Upcoming Games";
    upcomingGamesTable.appendChild(displayNoGamesRow);
  }
  games.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${new Date(game.gameDate).toLocaleString()}</td>
            <td>${game.teams.away.team.name}</td>
            <td>${game.venue.name}</td>
            <td>${game.status.detailedState}</td>
        `;
    upcomingGamesTable.appendChild(row);
  });
}

function displayAngelsUpcomingGames(games) {
  const upcomingAngelsGamesTable = document.getElementById(
    "angels-upcoming-games"
  );
  if (!games) return;
  const upcomingGamesTable = document.getElementById("angels-upcoming-games");
  if (games.length === 0) {
    const displayNoGamesRow = document.createElement("div");
    displayNoGamesRow.innerHTML = "No Upcoming Games";
    upcomingGamesTable.appendChild(displayNoGamesRow);
  }
  games.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${new Date(game.gameDate).toLocaleString()}</td>
            <td>${game.teams.away.team.name}</td>
            <td>${game.venue.name}</td>
            <td>${game.status.detailedState}</td>
        `;
    upcomingAngelsGamesTable.appendChild(row);
  });
}
