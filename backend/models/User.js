const db = require('../config/db');

class User {
    static async create(data) {
        const { nama, email, password, role } = data;
        return db.execute(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
            [nama, email, password, role || 'user']
        );
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static findAllMembers() {
        return db.execute('SELECT id, nama, email, role, created_at FROM users WHERE role = "user" ORDER BY created_at DESC');
    }

    static deleteById(id) {
        return db.execute('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = User;