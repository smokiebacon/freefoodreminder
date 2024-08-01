import AWS from "aws-sdk"

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-west-1",
})
export function sendWinnerEmails(dodgersData) {
  var params = {
    Destination: {
      ToAddresses: ["smokiebacon@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: JSON.stringify(dodgersData), // Convert dodgersData to string
        },
        Text: {
          Charset: "UTF-8",
          Data: "free panda",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Dodgers Won! $5 Panda Express coupon code 'dodgerswin' is active today until 11:59 PM",
      },
    },
    Source: "Free Food Reminder <smokiebacon@gmail.com>",
  }

  const ses = new AWS.SES({ apiVersion: "2010-12-01" })

  //get subscribers from Database
  //
  return ses
    .sendEmail(params)
    .promise()
    .then(function (data) {
      console.log(data.MessageId)
      return data
    })
    .catch(function (err) {
      console.error(err, err.stack)
      throw err
    })
}
