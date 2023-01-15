const nodemailer = require("nodemailer");
const SMTP_PORT = 587;
const HOST_SERVICE = "smtp-relay.sendinblue.com";

require("dotenv").config();

const Transporter = nodemailer.createTransport({
  host: HOST_SERVICE,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: "shubhamrakhecha5@gmail.com",
    pass: process.env.SMTP_PASS,
  },
});

module.exports = Transporter;
