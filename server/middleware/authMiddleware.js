const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = function (req, res, next) {
    let token = req.header('Authorization');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if the token starts with 'Bearer ' and remove the prefix
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }

    try {
        console.log('Verifying token:', token);
        const decoded = jwt.verify(token, keys.secretOrKey);
        console.log('Decoded token:', decoded);
        req.user = decoded; // Attach the decoded token payload to the request object
        console.log('User ID attached to request:', req.user.id);
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
