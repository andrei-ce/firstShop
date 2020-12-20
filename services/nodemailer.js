const nodemailer = require('nodemailer');
// const sendGridTransporter = require('nodemailer-sendgrid-transport');
// const config = require('config');

async function sendMail(options) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: options.from, // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

//this would be using sendGrid

// const transporter = nodemailer.createTransport(
//   sendGridTransporter({
//     auth: {
//       api_key: config.get('sendGrid_Key'),
//     },
//   })
// );

module.exports = sendMail;
