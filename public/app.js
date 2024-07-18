document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/mlb-schedule")
    .then((response) => response.json())
    .then((data) => {
      displayPastGames(data.pastHighScoringGames);
      displayUpcomingGames(data.futureHomeGames);
    })
    .catch((error) => console.error("Error:", error));
});

const todaysDate = new Date();
const date = "07/18/2024";
//https://github.com/jasonlttl/gameday-api-docs/blob/master/team-information.md
// https://statsapi.mlb.com/api/v1/schedule?hydrate=team,lineups&sportId=1&startDate=2024-03-01&endDate=2024-07-31&teamId=119
const dodgersTeamId = 119; //Dodgers Team ID
const angelsTeamId = 108; // Angels Team ID
const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&teamId=${dodgersTeamId}`;
const url2 = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&teamId=${angelsTeamId}`;

function displayResult(data, elementId) {
  const resultDiv = document.getElementById(elementId);
  resultDiv.innerHTML = "";

  if (
    data.dates &&
    data.dates.length > 0 &&
    data.dates[0].games &&
    data.dates[0].games.length > 0
  ) {
    const game = data.dates[0].games[0];
    resultDiv.innerHTML = `
            <p class="col-lg-8 mx-auto fs-5 text-muted">Game Date: ${game.gameDate}</p>
            <p>Home Team: ${game.teams.home.team.name}</p>
            <p>Home Team Score: ${game.teams.home.score}</p>
            <p>Home Team Winner: ${game.teams.home.isWinner}</p>
            <p>Away Team: ${game.teams.away.team.name}</p>
            <p>Away Team Score: ${game.teams.away.score}</>
        `;
  } else {
    resultDiv.innerHTML = `No game scheduled for today.`;
  }
}

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Dodgers data:", data);
    displayResult(data, "result");
  })
  .catch((error) => {
    console.error("Error fetching MLB schedule:", error);
    document.getElementById("result").innerHTML = `Error: ${error.message}`;
  });

fetch(url2)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Angels schedule data:", data);
    displayResult(data, "result2");
  })
  .catch((error) => {
    console.error("Error fetching MLB schedule:", error);
    document.getElementById("result").innerHTML = `Error: ${error.message}`;
  });

function displayPastGames(games) {
  const pastDodgerGameWinsTable = document.getElementById("pastGames");
  games.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${new Date(game.gameDate).toLocaleString()}</td>
              <td>${game.teams.away.team.name}</td>
              <td>${game.venue.name}</td>
              <td>${game.status.detailedState}</td>
          `;
    pastDodgerGameWinsTable.appendChild(row);
  });
}
function displayUpcomingGames(games) {
  const upcomingGamesTable = document.getElementById("upcomingGames");
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
