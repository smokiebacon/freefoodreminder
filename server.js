import express from "express"
import path from "path"
import { getMonthBoundaries } from "./date.js"
import { connectDB } from "./database.js"
import bodyParser from "body-parser"
import { sendSubscribeConfirmationEmail } from "./sendEmail.js"
import Subscription from "./models/Subscription.js"
import {
  fetchAndProcessMLBData,
  getCachedGameData,
  getDodgerAndAngelsCachedGamesData,
  fetchDodgerAndAngelsSchedule,
} from "./mlbDataService.js"
const app = express()
connectDB()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

fetchAndProcessMLBData()
fetchDodgerAndAngelsSchedule()

app.get("/todays-game", (req, res) => {
  const gameData = getCachedGameData()
  if (gameData) {
    res.json(gameData)
  } else {
    res.status(503).json({ error: "Data nost available yet" })
  }
})

app.get("/mlb-schedule", (req, res) => {
  const cachedGamesData = getDodgerAndAngelsCachedGamesData()

  if (cachedGamesData) {
    res.json(cachedGamesData)
  } else {
    res.status(503).json({ error: "Data nost available yet" })
  }
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/subscribe", async (req, res) => {
  try {
    const createdEmail = await Subscription.create(req.body)
    createdEmail.save()
    function generateUnsubscribeLink(userId) {
      // Convert ObjectId to its string representation
      const userIdString = userId.toString()
      return `http://localhost:3000/unsubscribe?id=${userIdString}`
    }
    const unsubscribeLink = generateUnsubscribeLink(createdEmail._id)
    const emailBodyHTML = `
    <html>
      <body>
          <h1>Hurray!</h1>
            <p>You are now subscribed to Free Food Reminder's email list.</p>
            <p>To unsubscribe from future emails, <a href="${unsubscribeLink}">click here</a>.</p>
      </body>
    </html>
    `
    //send subscription confirmation email
    sendSubscribeConfirmationEmail([createdEmail.email], emailBodyHTML)
    res.status(201).json({ message: "Subscription successful" })
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "Email already subscribed" })
    } else {
      console.error("Subscription error:", error)
      res.status(500).json({ message: "An error occurred during subscription" })
    }
  }
})
app.get(`/unsubscribe?:id`, async (req, res) => {
  try {
    const foundOneEmail = await Subscription.findByIdAndDelete(req.query.id)
    res
      .status(201)
      .json({ email: foundOneEmail, message: "Unsubscription successful" })
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "Email already unsubscribed" })
    } else {
      console.error("Subscription error:", error)
      res.status(500).json({ message: "An error occurred during subscription" })
    }
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
