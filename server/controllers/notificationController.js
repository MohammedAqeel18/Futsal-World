const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.sendNotification = (req, res) => {
    const { title, body, tokens } = req.body;

    const message = {
        notification: {
            title,
            body
        },
        tokens
    };

    admin.messaging().sendMulticast(message)
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ message: 'Error sending notification', error: err }));
};
