const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// POST route to send email
app.post('/api/send-email', upload.single('photo'), (req, res) => {
    const { candidateName, monthlyIncome, manglik, birthPlace, birthDate, height, skinColor, education, fatherName, familyProfession, address, mobile, gotraSelf, gotraMother, gotraGrandmother, gotraNani } = req.body;
    const filePath = req.file.path;

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'viprfoundation@gmail.com', // Your email
            pass: 'gmvh mnrk odxo hapf', // Your email app password
        }
    });

    // Setup email data
    const mailOptions = {
        from: 'viprfoundation@gmail.com',
        to: 'viprfoundation@gmail.com', // Change this to the recipient email
        subject: 'New Form Submission',
        text: `Candidate Name: ${candidateName}\nMonthly Income: ${monthlyIncome}\nManglik: ${manglik}\nBirth Place: ${birthPlace}\nBirth Date: ${birthDate}\nHeight: ${height}\nSkin Color: ${skinColor}\nEducation: ${education}\nFather Name: ${fatherName}\nFamily Profession: ${familyProfession}\nAddress: ${address}\nMobile: ${mobile}\nGotra Self: ${gotraSelf}\nGotra Mother: ${gotraMother}\nGotra Grandmother: ${gotraGrandmother}\nGotra Nani: ${gotraNani}`,
        attachments: [
            {
                path: filePath // Path to the uploaded file
            }
        ]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.toString());
        }
        res.send('Form submitted successfully!');
    });
});

// Export the app for Vercel
module.exports = app;
