const db = require("../config/db");

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            "SELECT id, username, email, created_at FROM users WHERE id = ?", [userId]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        const user = users[0];

    } catch (error) {
        console.error("Profil Çekme Hatası:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};