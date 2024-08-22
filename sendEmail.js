import AWS from "aws-sdk"
import "dotenv/config"
import Subscription from "./models/Subscription.js"

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-east-1",
})

export function sendSubscribeConfirmationEmail(email, emailBodyHTML) {
  var params = {
    Destination: {
      ToAddresses: email,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailBodyHTML,
        },
        Text: {
          Charset: "UTF-8",
          Data: "free panda",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Subscription Confirmation",
      },
    },
    Source: "Free Food Reminder <smokiebacon@gmail.com>",
  }

  const ses = new AWS.SES({ apiVersion: "2010-12-01" })

  return ses
    .sendEmail(params)
    .promise()
    .then(function (data) {
      console.log(
        params.Destination.ToAddresses,
        "Subscription Confirmation email sent"
      )
      return data
    })
    .catch(function (err) {
      console.error(err, err.stack)
      throw err
    })
}
export async function sendWinnerEmails(personalizedEmails) {
  const ses = new AWS.SES({ apiVersion: "2010-12-01" })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const results = []
  for (const { email, html } of personalizedEmails) {
    let tracker = await Subscription.findOne({ email })
    if (tracker && tracker.lastSentDate >= today) {
      console.log(email, "Email already sent today. Skipping.")
      results.push({ email, status: "skipped" })
      continue
    }
    var params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
          Text: {
            Charset: "UTF-8",
            Data: "free panda",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Dodgers Won Yesterday! Panda Express coupon code is active.",
        },
      },
      Source: "Free Food Reminder <smokiebacon@gmail.com>",
    }

    try {
      const data = await ses.sendEmail(params).promise()
      console.log(email, "Dodger Winner email sent")
      if (tracker) {
        tracker.lastSentDate = new Date()
        await tracker.save()
      } else {
        await Subscription.create({ email, lastSentDate: new Date() })
      }
      results.push({ email, status: "sent" })
    } catch (err) {
      console.error(err, err.stack)
      results.push(err)
    }
  }

  return results
}
