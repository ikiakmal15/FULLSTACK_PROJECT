const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_sewa_lapangan'
});
module.exports = db.promise();