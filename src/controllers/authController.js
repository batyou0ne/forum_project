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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.query(sql, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
};
