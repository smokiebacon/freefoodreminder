import AWS from "aws-sdk"

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-west-1",
})

export function sendWinnerEmails(dodgersData, emailList) {
  console.log(emailList, "list")
  var params = {
    Destination: {
      ToAddresses: emailList,
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
