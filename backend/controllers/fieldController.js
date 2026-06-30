const Field = require("../models/Field");
const timeHelper = require("../utils/timeHelper");

exports.getAllFields = async (req, res) => {
  try {
    const [rows] = await Field.findAllWithBookings();
    const dataFormat = rows.map((field) => ({
      ...field,
      tanggal_terbooking: field.tanggal_terbooking
        ? field.tanggal_terbooking.split(",")
        : [],
    }));
    res.json(dataFormat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFieldById = async (req, res) => {
  try {
    const [rows] = await Field.findById(req.params.id);
    if (!rows || rows.length === 0)
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addField = async (req, res) => {
  try {
    const {
      nama_lapangan,
      tipe,
      harga_per_jam,
      deskripsi,
      jam_buka,
      jam_tutup,
    } = req.body;
    const namaGambar = req.file ? req.file.filename : null;

    const payload = {
      nama_lapangan,
      tipe,
      harga_per_jam,
      deskripsi: deskripsi || null,
      jam_buka: timeHelper.formatJamMenitDetik(jam_buka),
      jam_tutup: timeHelper.formatJamMenitDetik(jam_tutup),
      gambar: namaGambar,
    };

    await Field.create(payload);
    res
      .status(201)
      .json({ message: "Lapangan baru beserta foto berhasil ditambahkan!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_lapangan,
      tipe,
      harga_per_jam,
      deskripsi,
      jam_buka,
      jam_tutup,
    } = req.body;
    const namaGambar = req.file ? req.file.filename : null;

    const payload = {
      nama_lapangan,
      tipe,
      harga_per_jam,
      deskripsi: deskripsi || null,
      jam_buka: timeHelper.formatJamMenitDetik(jam_buka),
      jam_tutup: timeHelper.formatJamMenitDetik(jam_tutup),
      gambar: namaGambar,
    };

    if (namaGambar) {
      await Field.updateWithImage(id, payload);
    } else {
      await Field.updateWithoutImage(id, payload);
    }
    res.json({ message: "Data lapangan berhasil diperbarui!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteField = async (req, res) => {
  try {
    await Field.delete(req.params.id);
    res.json({ message: "Lapangan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
