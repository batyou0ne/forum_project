const db = require("../config/db"); // Veritabanı bağlantını buradan alıyor
const bcrypt = require("bcrypt"); // Şifreleme kütüphanesi (Eğer kullanıyorsan)

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    
    // Veritabanına kaydet
    await db.query(sql, [username, email, hashedPassword]);

    // BAŞARILI CEVABI (Burası çok önemli, eksikse frontend beklemede kalır)
    res.status(201).json({ message: "Kayıt başarıyla oluşturuldu! 🎉" });

  } catch (error) {
    console.error("Kayıt Hatası:", error);

    // Hata: Duplicate Entry (Aynı kullanıcı adı veya email)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: "Bu kullanıcı adı veya e-posta zaten kullanımda!" 
      });
    }

    // Diğer Hatalar
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};