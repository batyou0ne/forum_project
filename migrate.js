const db = require("./src/config/db.js");

async function migrate() {
    try {
        console.log("⏳ Migration başlatılıyor...");

        // Kolon zaten var mı kontrol et
        const [rows] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'banned_until'
    `);

        if (rows.length === 0) {
            await db.query(`
        ALTER TABLE users
        ADD COLUMN banned_until DATETIME DEFAULT NULL
      `);
            console.log("✅ banned_until kolonu eklendi.");
        } else {
            console.log("ℹ️  banned_until kolonu zaten mevcut, atlanıyor.");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Migration hatası:", err);
        process.exit(1);
    }
}

migrate();
