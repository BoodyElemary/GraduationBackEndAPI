// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const twilio = require("twilio");
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const sendEmail = async (to, subject, body) => {
//   const message = {
//     to: to,
//     from: 'your_email@example.com',
//     subject: subject,
//     html: body,
//   };

//   try {
//     await sgMail.send(message);
//     console.log(`Email sent to ${to}`);
//   } catch (err) {
//     console.error(`Error sending email to ${to}: ${err.message}`);
//   }
// };

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
// const formData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
// 	username: 'api',
// 	key: 'ea8fab67103dfcde92b55d8095a21f86-af778b4b-f5705ae2',
// });
// mg.messages
// 	.create(sandbox7bc6e06738ee4fbfaf53730695222d8d.mailgun.org, {
// 		from: "Mailgun Sandbox <postmaster@sandbox7bc6e06738ee4fbfaf53730695222d8d.mailgun.org>",
// 		to: ["ahmed.mohamed.abdelkader1@gmail.com"],
// 		subject: "Hello",
// 		text: "Testing some Mailgun awesomness!",
// 	})
// 	.then(msg => console.log(msg)) // logs response data
// 	.catch(err => console.log(err)); // logs any error`;

// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.
const path = require("path");
const nodemailer = require("nodemailer");
const { setResetPasswordView } = require(path.join(
  __dirname,
  "..",
  "view",
  "email-form"
));
const transporter = nodemailer.createTransport({
  service: "Mail.ru",
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

// Function to send the email
const sendEmail = (userEmail, htmlMessage) => {
  const mailOptions = {
    from: "emailittest99@mail.ru",
    to: userEmail,
    subject: "Welcome to My App",
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const sendResetEmail = async (userEmail, link) => {
  const mailOptions = {
    from: {
      name: "Bobazona Support",
      address: "emailittest99@mail.ru",
    },
    to: userEmail,
    subject: "Reset Bobazona password",
    html: setResetPasswordView(link),
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    } else {
      return false;
    }
  });
};
module.exports = {
  sendEmail,
  sendResetEmail,
};
