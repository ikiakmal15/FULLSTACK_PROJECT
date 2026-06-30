const User = require('../models/User');
const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await User.findAllMembers();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const [result] = await userService.processDeleteUserCascade(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pengguna tidak ditemukan di database." });
        res.json({ message: "Pengguna beserta seluruh riwayatnya berhasil dihapus dari sistem." });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus pengguna karena kendala sistem database." });
    }
};