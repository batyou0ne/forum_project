const mysql = require('mysql2/promise');
require('dotenv').config(); // .env dosyasını okumak için (birazdan kuracağız)

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Port verilmezse 3306 varsay
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Bağlantıyı test edelim (Opsiyonel, konsolda görmek için)
pool.getConnection()
    .then(conn => {
        console.log("✅ Veritabanına başarıyla bağlanıldı!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Veritabanı bağlantı hatası:", err.message);
    });

module.exports = pool;