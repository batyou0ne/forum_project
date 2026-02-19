const db = require("../config/db");

module.exports = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const [banRows] = await db.query(
            "SELECT banned_until FROM users WHERE id = ?",
            [userId]
        );

        if (banRows.length > 0 && banRows[0].banned_until) {
            const bannedUntil = new Date(banRows[0].banned_until);
            const now = new Date();
            if (bannedUntil > now) {
                const remaining = Math.ceil((bannedUntil - now) / 60000);
                return res.status(403).json({
                    message: `Spam nedeniyle yasaklandınız. ${remaining} dakika sonra tekrar deneyebilirsiniz.`,
                });
            }
        }

        const [cooldownRows] = await db.query(
            "SELECT created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            [userId]
        );

        if (cooldownRows.length > 0) {
            const lastPostTime = new Date(cooldownRows[0].created_at);
            const now = new Date();
            const diffMinutes = (now - lastPostTime) / 60000;

            if (diffMinutes < 2) {
                const waitSeconds = Math.ceil((2 - diffMinutes) * 60);
                return res.status(429).json({
                    message: `Yeni bir post oluşturmadan önce ${waitSeconds} saniye bekleyin.`,
                });
            }
        }

        const [spamRows] = await db.query(
            "SELECT COUNT(*) AS count FROM posts WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 12 MINUTE)",
            [userId]
        );

        if (spamRows[0].count >= 4) {
            const banUntil = new Date(Date.now() + 60 * 60 * 1000);
            await db.query("UPDATE users SET banned_until = ? WHERE id = ?", [
                banUntil,
                userId,
            ]);
            return res.status(403).json({
                message: "12 dakika içinde çok fazla post attınız. 1 saatliğine yasaklandınız.",
            });
        }

        next();
    } catch (err) {
        console.error("Rate limit hatası:", err);
        return res.status(500).json({ message: "Rate limit kontrolü sırasında hata oluştu." });
    }
};
