const db = require('../config/db');

class Payment {
    static create(data) {
        const { booking_id, metode_bayar, bukti_bayar } = data;
        return db.execute(
            'INSERT INTO payments (booking_id, metode_bayar, bukti_bayar, status_pembayaran) VALUES (?, ?, ?, "pending")',
            [booking_id, metode_bayar, bukti_bayar]
        );
    }

    static updateStatus(booking_id, status) {
        return db.execute(
            'UPDATE payments SET status_pembayaran = ? WHERE booking_id = ? AND status_pembayaran = "pending"',
            [status, booking_id]
        );
    }

    static deleteByBookingId(booking_id) {
        return db.execute('DELETE FROM payments WHERE booking_id = ?', [booking_id]);
    }
}

module.exports = Payment;