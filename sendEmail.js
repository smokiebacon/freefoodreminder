// Load the AWS SDK for Node.js
import AWS from "aws-sdk"

AWS.config.update({
  accessKeyId: "AKIATXK2E5IHBNYROGXG" || process.env.AWS_ACCESS_KEY,
  secretAccessKey:
    "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" || process.env.AWS_SECRET_KEY,
  region: "us-east-1",
})
export function sendWinnerEmails(dodgersData) {
  var params = {
    Destination: {
      CcAddresses: ["smokiebacon@gmail.com"],
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
    Source: "smokiebacon@gmail.com",
    ReplyToAddresses: ["smokiebacon@gmail.com"],
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
