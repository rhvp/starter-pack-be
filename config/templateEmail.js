const nodemailer = require("nodemailer");
const Email = require("email-templates");

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: '465',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
    views: {
      options: {
        extension: "ejs"
      }
    }
  });

  // 2) Define the email options
  const mailOptions = {
    template: options.template,
    message: {
      from: options.from,
      to: options.email,
      subject: options.subject,
      replyTo: options.replyTo
      // text: options.text,
    },
    locals: {
      products: options.products,
      customer: options.customer,
      amount: options.amount,
      user: options.user,
      order: options.order
    }
  };

  // 3) Actually send the email
  await email.send(mailOptions)
};

module.exports = sendEmail;
