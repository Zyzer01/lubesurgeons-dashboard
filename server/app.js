const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index.js');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const port = process.env.PORT || 3000;
const axios = require('axios');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');
const path = require('path');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Read the image file and convert it to Base64
const imagePath = path.join(__dirname, 'views', 'lubsurgeons.png');
const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

app.use('/', indexRouter);

app.post('/send-message', async (req, res) => {
  try {
    const { fName, email, subject, message } = req.body;

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'mail.lubesurgeons.com',
      port: 465,
      secure: true,
      auth: {
        user: 'test@lubesurgeons.com',
        pass: '?kH1v7)%c)Rh',
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./views'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views'),
      extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
      from: email,
      to: 'devzyzer@gmail.com',
      subject: subject,
      template: 'contact',
      context: {
        fName: fName,
        email: email,
        subject: subject,
        message: message,
      },
    };
    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);

    res
      .status(500)
      .json({ error: 'An error occurred while sending the email' });
  }
});

//Booking Form

app.post('/send-booking', async (req, res) => {
  try {
    const {
      name,
      email,
      service,
      ngState,
      lga,
      date,
      carBrand,
      carModel,
      carYear,
    } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'mail.lubesurgeons.com',
      port: 465,
      secure: true,
      auth: {
        user: 'test@lubesurgeons.com',
        pass: '?kH1v7)%c)Rh',
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./views'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views'),
      extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    const formatDateTime = (dateTimeString) => {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateTimeString).toLocaleDateString('en-US', options);
    };

    
    const mailOptions = {
      from: '"Lubesurgeons" <test@lubesurgeons.com>',
      to: email,
      subject: 'Appointment Details',
      template: 'booking',
      context: {
        name: name,
        service: service,
        state: ngState,
        lga: lga,
        date: formatDateTime(date),
        carBrand: carBrand,
        carModel: carModel,
        carYear: carYear,
        imageUrl: `data:image/png;base64,${imageBase64}`,  
      },
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    // Respond to the client indicating success
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    // Respond with an error status and message
    res
      .status(500)
      .json({ error: 'An error occurred while sending the email' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
