import AWS from "aws-sdk"
import "dotenv/config"
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
      console.log(data.MessageId)
      console.log("Subscription Confirmation email sent")
      return data
    })
    .catch(function (err) {
      console.error(err, err.stack)
      throw err
    })
}

export function sendWinnerEmails(personalizedEmails) {
  for (const { email, html } of personalizedEmails) {
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

    const ses = new AWS.SES({ apiVersion: "2010-12-01" })

    return ses
      .sendEmail(params)
      .promise()
      .then(function (data) {
        console.log(data.MessageId)
        console.log("Dodger Winner Email Sent")
        return data
      })
      .catch(function (err) {
        console.error(err, err.stack)
        throw err
      })
  }
}
