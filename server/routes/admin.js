const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const adminController = require('../controllers/adminController');

router.post('/login', adminController.adminLogin);
router.get('/reservations', adminAuthMiddleware, adminController.getReservations);
router.delete('/reservations/:id', adminAuthMiddleware, adminController.cancelReservation);
router.post('/knockout-table', adminAuthMiddleware, adminController.updateKnockoutTable);
router.get('/users', adminAuthMiddleware, adminController.getUsers);
router.delete('/users/:id', adminAuthMiddleware, adminController.removeUser);

module.exports = router;
