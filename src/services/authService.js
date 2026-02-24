const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (username, email, password) => {

    if (!username || username.trim().length === 0) {
        throw new Error("Kullanıcı adı boş bırakılamaz!");
    }

    if (/[^a-zA-Z0-9_çğıöşüÇĞİÖŞÜ]/.test(username)) {
        throw new Error("Kullanıcı adında sadece harf, rakam ve alt çizgi kullanılabilir!");
    }

    if (/\s/.test(password)) {
        throw new Error("Şifrede boşluk kullanılamaz!");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        await db.query(sql, [username, email, hashedPassword]);

        return { message: "Kayıt başarıyla oluşturuldu!" };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("Bu kullanıcı adı veya e-posta zaten kullanımda!");
        }

        throw error;
    }



}


exports.loginUser = async (email, password) => {

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
        throw new Error("Kullanıcı bulunamadı veya şifre yanlış.");
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Kullanıcı bulunamadı veya şifre yanlış.");
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "gizlisifre",
        { expiresIn: "1h" }
    );

    return {
        token: token,
        userId: user.id,
        user: { id: user.id, username: user.username }
    };
};