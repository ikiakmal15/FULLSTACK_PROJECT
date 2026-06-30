const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/my-bookings', verifyToken, bookingController.getUserBookings);
router.get('/admin/all', verifyToken, isAdmin, bookingController.getAllBookings);
router.post('/admin/cancel/:id', verifyToken, isAdmin, bookingController.cancelBooking);
router.delete('/:id', verifyToken, bookingController.deleteBookingByUser);

module.exports = router;