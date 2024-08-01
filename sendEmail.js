// Load the AWS SDK for Node.js
<<<<<<< HEAD
import AWS from "aws-sdk"
=======
import AWS from "aws-sdk";
>>>>>>> d6e54dc583a33f7de362d8a0e37d3951ccad7134

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
<<<<<<< HEAD
  region: "us-west-1",
})
=======
  region: "us-east-1",
});
>>>>>>> d6e54dc583a33f7de362d8a0e37d3951ccad7134
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
<<<<<<< HEAD
  }

  const ses = new AWS.SES({ apiVersion: "2010-12-01" })
=======
  };

  const ses = new AWS.SES({ apiVersion: "2010-12-01" });
>>>>>>> d6e54dc583a33f7de362d8a0e37d3951ccad7134

  //get subscribers from Database
  //
  return ses
    .sendEmail(params)
    .promise()
    .then(function (data) {
<<<<<<< HEAD
      console.log(data.MessageId)
      return data
    })
    .catch(function (err) {
      console.error(err, err.stack)
      throw err
    })
=======
      console.log(data.MessageId);
      return data;
    })
    .catch(function (err) {
      console.error(err, err.stack);
      throw err;
    });
>>>>>>> d6e54dc583a33f7de362d8a0e37d3951ccad7134
}
