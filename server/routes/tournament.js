// routes/tournament.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tournamentController = require('../controllers/tournamentController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');  // Add this line


router.post('/register', authMiddleware, tournamentController.registerTeam);
router.post('/create-payment-intent', authMiddleware, tournamentController.createPaymentIntent);
router.post('/send-qr-code', authMiddleware, tournamentController.sendQrCode);
router.get('/registered-teams', authMiddleware, tournamentController.getRegisteredTeams); // Add route to fetch registered teams
router.get('/available', tournamentController.getAvailableTournaments); // Add route to fetch available tournaments

// Admin routes for tournament management
router.get('/admin-settings', adminAuthMiddleware, tournamentController.getAdminTournamentSettings);


router.post('/admin-settings', adminAuthMiddleware, tournamentController.saveTournamentSettings);


router.get('/admin/registered-teams', adminAuthMiddleware, tournamentController.getRegisteredTeams); 
router.delete('/remove-team/:teamId', adminAuthMiddleware, tournamentController.removeTeam);

router.post('/generate-bracket', adminAuthMiddleware, tournamentController.generateBracket);
// Advance team in the bracket
router.post('/advance-team', adminAuthMiddleware, tournamentController.advanceTeam);

router.get('/:sport/bracket', tournamentController.getBracket); // Bracket route based on sport

router.post('/:sport/update-bracket', adminAuthMiddleware, tournamentController.updateBracket);

router.post('/close-registration', adminAuthMiddleware, tournamentController.closeRegistrationAndEnableBracket);


// Route for updating the bracket with selected winners
//router.post('/tournament/:sport/update-bracket', adminAuthMiddleware, tournamentController.updateBracket);

module.exports = router;
