const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getAdminStats = async (req, res) => {
    try {
        const [totalUser] = await User.findAllMembers();
        const [totalBooking] = await Booking.countTotalBookings();
        const [pendapatan] = await Booking.calculateTotalIncome();
        const [recentBookings] = await Booking.findRecentWithDetails(5);

        res.json({
            stats: {
                users: totalUser.length,
                bookings: totalBooking[0]?.count || 0,
                income: pendapatan[0]?.total || 0
            },
            recentBookings: recentBookings || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};