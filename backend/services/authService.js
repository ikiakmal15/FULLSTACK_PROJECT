const User = require('../models/User');
const authHelper = require('../utils/authHelper');

exports.processRegister = async ({ nama, email, password, role }) => {
    const hashedPassword = await authHelper.hashPassword(password);
    return await User.create({ nama, email, password: hashedPassword, role });
};

exports.processLogin = async ({ email, password }) => {
    const user = await User.findByEmail(email);
    if (!user) throw new Error("User tidak ditemukan");

    const isMatch = await authHelper.comparePassword(password, user.password);
    if (!isMatch) throw new Error("Password salah");

    const token = authHelper.generateToken({ id: user.id, role: user.role });
    return { token, user: { id: user.id, nama: user.nama, role: user.role } };
};