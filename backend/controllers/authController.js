const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { nama, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ nama, email, password: hashedPassword, role });
        res.status(201).json({ message: "User berhasil didaftarkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.json({ token, user: { id: user.id, nama: user.nama, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};