const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware to parse JSON and urlencoded data
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
app.post('/send-email', upload.single('photo'), (req, res) => {
    const { candidateName, monthlyIncome, manglik, birthPlace, birthDate, height, skinColor, education, fatherName, familyProfession, address, mobile, gotraSelf, gotraMother, gotraGrandmother, gotraNani } = req.body;
    const filePath = req.file ? req.file.path : null;

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'viprfoundation@gmail.com',
            pass: 'gmvh mnrk odxo hapf' // Use your actual app password here
        }
    });

    // Email options
    const mailOptions = {
        from: 'viprfoundation@gmail.com',
        to: 'viprfoundation@gmail.com', // Replace with the actual recipient email
        subject: 'New Form Submission',
        text: `Candidate Name: ${candidateName}
        Monthly Income: ${monthlyIncome}
        Manglik: ${manglik}
        Birth Place: ${birthPlace}
        Birth Date: ${birthDate}
        Height: ${height}
        Skin Color: ${skinColor}
        Education: ${education}
        Father Name: ${fatherName}
        Family Profession: ${familyProfession}
        Address: ${address}
        Mobile: ${mobile}
        Gotra (Self): ${gotraSelf}
        Gotra (Mother): ${gotraMother}
        Gotra (Grandmother): ${gotraGrandmother}
        Gotra (Nani): ${gotraNani}`,
        attachments: filePath ? [{
            filename: path.basename(filePath),
            path: filePath
        }] : [] // Only attach if filePath is available
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Failed to send email. Please try again.');
        }
        res.send('Email sent successfully!');
    });
});

// Export the app for Vercel
module.exports = app;
