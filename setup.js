const db = require("./src/config/db.js");

async function createTables() {
  try {
    console.log("⏳ Veritabanına bağlanılıyor ve tablolar oluşturuluyor...");

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users tablosu hazır.");

    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Posts tablosu hazır.");

    console.log("🚀 Tüm tablolar başarıyla oluşturuldu! Çıkış yapılıyor...");
    process.exit();

  } catch (err) {
    console.error("❌ HATA OLUŞTU:", err);
    process.exit(1);
  }
}

createTables();