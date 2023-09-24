const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('./schemas/User');
const data = require('./data');

mongoose.connect('mongodb+srv://tarun:tarunsai2341@cluster0.tbd0fbb.mongodb.net/login_DB?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected Successfully");
    sendEmails();
  })
  .catch(err => console.log("Error Occurred: " + err));

async function sendEmails() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tarunsaisrinivas7@gmail.com',
      pass: 'cgtw trom outi dsdw'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  for (const scholarship of data) {
    try {
      const { caste, ownHouse, income, job, vehicle } = scholarship;
    //   console.log(scholarship);
      const eligibleUsers = await User.find({
        'details.caste': { $eq: caste },
        'details.ownHouse': { $eq: ownHouse },
        'details.income': { $eq: income },
        'details.job': { $eq: job },
        'details.vehicle': { $eq: vehicle }
      });
    //   console.log(eligibleUsers);
      for (const user of eligibleUsers) {
        const mailOptions = {
          from: 'tarunsaisrinivas7@gmail.com',
          to: user.userName,
          subject: 'You are eligible for this!',
          text: `
            We are delighted to let you know that you might be eligible for this scholarship.
            Here is the link: ${scholarship.url}
          `
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    } catch (error) {
      console.error('Error querying database: ', error);
    }
  }
}
