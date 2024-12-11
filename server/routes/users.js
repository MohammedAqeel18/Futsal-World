const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// @route GET api/users/me
// @desc Return current user
// @access Private
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
