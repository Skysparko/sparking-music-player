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
    pass: "xsmtpsib-4703c4f52c2cc28c1639754ba6b218dc5340f2525d541e6c8698e82ae494abd4-ZakOLIsv6b2dy9D1",
  },
});

module.exports = Transporter;
