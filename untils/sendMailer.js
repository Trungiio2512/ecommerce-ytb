const nodemailer = require("nodemailer");
const asynchandler = require("express-async-handler");
const sendMailer = asynchandler(async ({ email, html, subject = "Forgot Password ✔" }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORDS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Cuahangdientu 👻"<no-repply> <cuahangdientu@gmail.com>', // sender address
    to: email, // list of receivers
    subject, // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });
  return info;
});
module.exports = sendMailer;
