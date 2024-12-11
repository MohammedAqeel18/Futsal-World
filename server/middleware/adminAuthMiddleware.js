const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, keys.secretOrKey);
        req.admin = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};
