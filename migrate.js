const db = require("./src/config/db.js");

async function migrate() {
    try {
        console.log("⏳ Migration başlatılıyor...");

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
        }

        await db.query(
            "UPDATE users SET role = 'admin' WHERE email = ?",
            ["batuhankeskn0@gmail.com"]
        );
        console.log("✅ Admin rolü atandı.");

        process.exit(0);
    } catch (err) {
        console.error("❌ Migration hatası:", err);
        process.exit(1);
    }
}

migrate();
