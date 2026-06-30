const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.processUploadPayment = async ({ booking_id, metode_bayar, bukti_bayar }) => {
    const [booking] = await Booking.updateStatus(booking_id, 'waiting_confirmation');
    if (booking.affectedRows === 0) throw new Error("Data booking tidak ditemukan.");

    return await Payment.create({ booking_id, metode_bayar, bukti_bayar });
};

exports.processConfirmPayment = async ({ booking_id, status }) => {
    const statusValid = status?.toLowerCase();
    const [paymentResult] = await Payment.updateStatus(booking_id, statusValid);

    if (paymentResult.affectedRows === 0) {
        throw new Error("Tidak ada transaksi pembayaran pending yang ditemukan untuk ID ini.");
    }

    const bookingStatus = statusValid === 'success' ? 'confirmed' : 'cancelled';
    return await Booking.updateStatus(booking_id, bookingStatus);
};