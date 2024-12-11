const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'maheng907@gmail.com',
        pass: 'inimupugqjlxminw'
    }
});

const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
    try {
        // Generate QR Code with booking details and save it to a file
        const qrData = JSON.stringify(bookingDetails);
        const qrCodePath = './qrcode.png';
        await QRCode.toFile(qrCodePath, qrData);
        const confirmationUrl = `http://localhost:3000/confirm-booking?bookingId=${bookingDetails.bookingId}`;
        const qrCodeUrl = bookingDetails.qrCodeUrl; // Use the provided QR code URL

        
        const mailOptions = {
            from: 'futsal@gmail.com',
            to: userEmail,
            subject: 'Booking Confirmation',
            html: `
                <p>Dear user,</p>
                <p>Your booking has been confirmed.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li><strong>Ground:</strong> ${bookingDetails.ground}</li>
                    <li><strong>Date:</strong> ${bookingDetails.date}</li>
                    <li><strong>Time Slot:</strong> ${bookingDetails.timeSlot}</li>
                    <li><strong>Amount:</strong> ${bookingDetails.amount}</li>
                </ul>
                <p>Scan the QR code attached to this email to view your booking details.</p>
                <p>Thank you for booking with us!</p>
            `,
            attachments: [
                {
                    filename: 'qrcode.jpg',
                    path: qrCodePath,
                    cid: 'qrcode' // same cid value as in the html img src
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }

            // Remove the QR code file after sending the email
            fs.unlinkSync(qrCodePath);
        });
    } catch (error) {
        console.log('Error generating QR code or sending email:', error);
    }
};

module.exports = { sendBookingConfirmationEmail };
