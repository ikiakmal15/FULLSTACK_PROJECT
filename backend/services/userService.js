const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

exports.processDeleteUserCascade = async (id) => {
    await Review.deleteByUserId(id);

    const [userBookings] = await Booking.findByUserId(id);
    if (userBookings.length > 0) {
        for (const booking of userBookings) {
            await Payment.deleteByBookingId(booking.id);
        }
    }

    await Booking.deleteByUserId(id);
    return await User.deleteById(id);
};