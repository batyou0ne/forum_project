// src/controllers/authController.js

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Token oluşturmak için (Eğer jwt kullanıyorsan)

// 1. REGISTER (KAYIT OL)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    await db.query(sql, [username, email, hashedPassword]);

    res.status(201).json({ message: "Kayıt başarıyla oluşturuldu! 🎉" });

  } catch (error) {
    console.error("Kayıt Hatası:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: "Bu kullanıcı adı veya e-posta zaten kullanımda!"
      });
    }

    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

// 2. LOGIN (GİRİŞ YAP) - BURASI EKSİKTİ!
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kullanıcıyı bul
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı veya şifre yanlış." });
    }

    const user = users[0];

    // 2. Şifreyi kontrol et (Hash kıyaslama)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı veya şifre yanlış." });
    }

    // 3. Token oluştur (JWT_SECRET .env dosyasında olmalı)
    // Eğer JWT kullanmıyorsan burayı basitleştirebiliriz ama genelde böyledir.
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "gizlisifre",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Giriş başarılı!",
      token: token,
      userId: user.id, // Frontend bu şekilde bekliyor
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error("Login Hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};