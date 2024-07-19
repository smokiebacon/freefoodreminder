// Load the AWS SDK for Node.js
import AWS from "aws-sdk";
AWS.config.update({
  accessKeyId: "AKIATXK2E5IHBNYROGXG" || process.env.AWS_ACCESS_KEY,
  secretAccessKey:
    "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" || process.env.AWS_SECRET_KEY,
  region: "us-east-1",
});
// Create sendEmail params
var params = {
  Destination: {
    /* required */
    CcAddresses: [
      "smokiebacon@gmail.com",
      /* more items */
    ],
    ToAddresses: [
      "smokiebacon@gmail.com",
      /* more items */
    ],
  },
  Message: {
    /* required */
    Body: {
      /* required */
      Html: {
        Charset: "UTF-8",
        Data: "HTML_FORMAT_BODY",
      },
      Text: {
        Charset: "UTF-8",
        Data: "free panda",
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Yahoo!!",
    },
  },
  Source: "smokiebacon@gmail.com" /* required */,
  ReplyToAddresses: [
    "smokiebacon@gmail.com",
    /* more items */
  ],
};
// Create the promise and SES service object
var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
  .sendEmail(params)
  .promise();

// Handle promise's fulfilled/rejected states
sendPromise
  .then(function (data) {
    console.log(data.MessageId);
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });
