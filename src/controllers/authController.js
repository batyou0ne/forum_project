// src/controllers/authController.js

const db = require("../config/db"); // Veritabanı bağlantını buradan alıyor
const bcrypt = require("bcrypt"); // Şifreleme kütüphanesi (Eğer kullanıyorsan)

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Şifreyi hash'le (Eğer bcrypt kullanıyorsan bu satırı aç)
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Eğer kullanmıyorsan direkt password değişkenini kullan.

    // Not: Aşağıdaki sorguda 'password' yerine hashlenmiş şifreyi kullanman güvenlik için daha iyidir.
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    
    // Veritabanına kaydet
    await db.query(sql, [username, email, password]);

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