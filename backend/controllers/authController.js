const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        await authService.processRegister(req.body);
        res.status(201).json({ message: "User berhasil didaftarkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authService.processLogin(req.body);
        res.json(result);
    } catch (error) {
        if (error.message === "User tidak ditemukan") return res.status(404).json({ message: error.message });
        if (error.message === "Password salah") return res.status(401).json({ message: error.message });
        res.status(500).json({ error: error.message });
    }
};