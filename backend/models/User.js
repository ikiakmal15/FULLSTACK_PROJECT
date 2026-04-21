const db = require('../config/db');

class User {
    static async create(data) {
        const { nama, email, password, role } = data;
        return db.execute(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
            [nama, email, password, role]
        );
    }
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }
}
module.exports = User;