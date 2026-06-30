const Booking = require('../models/Booking');
const Field = require('../models/Field');

exports.processNewBooking = async ({ user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga }) => {
    const waktuSekarang = new Date();
    const waktuBooking = new Date(tanggal + ' ' + jam_mulai);
    if (waktuBooking < waktuSekarang) {
        throw new Error("Anda tidak bisa memesan untuk waktu yang sudah lewat!");
    }

    const [field] = await Field.findById(field_id);
    if (field.length === 0) throw new Error("Data lapangan tidak ditemukan!");

    if (jam_mulai < field[0].jam_buka || jam_selesai > field[0].jam_tutup) {
        throw new Error(`Lapangan hanya beroperasi antara jam ${field[0].jam_buka} sampai ${field[0].jam_tutup}`);
    }

    const [isBooked] = await Booking.checkAvailability(field_id, tanggal, jam_mulai, jam_selesai);
    if (isBooked.length > 0) throw new Error("Jadwal sudah terisi, silakan pilih jam lain.");

    return await Booking.create({ user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga });
};