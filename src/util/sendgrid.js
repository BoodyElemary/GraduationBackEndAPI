const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const twilio = require("twilio");
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const sendEmail = async (to, subject, body) => {
  const message = {
    to: to,
    from: "your_email@example.com",
    subject: subject,
    html: body,
  };

  try {
    await sgMail.send(message);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}: ${err.message}`);
  }
};

// const sendSMS = async (to, body) => {
//   try {
//     await client.messages.create({
//       to: to,
//       from: "+1415XXXXXXX", // replace with your Twilio phone number
//       body: body,
//     });
//     console.log(`SMS sent to ${to}`);
//   } catch (err) {
//     console.error(`Error sending SMS to ${to}: ${err.message}`);
//   }
// };