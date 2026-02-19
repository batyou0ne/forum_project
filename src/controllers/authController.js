const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (/\s/.test(username)) {
      return res.status(400).json({ message: "Kullanıcı adında boşluk kullanılamaz!" });
    }

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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı veya şifre yanlış." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı veya şifre yanlış." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "gizlisifre",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Giriş başarılı!",
      token: token,
      userId: user.id,
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error("Login Hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};