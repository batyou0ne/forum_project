const db = require("../config/db");

module.exports = async (req, res, next) => {
    const userId = req.user.id;

    if (req.user.role === "admin") return next();

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
            "SELECT created_at FROM comments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            [userId]
        );

        if (cooldownRows.length > 0) {
            const lastCommentTime = new Date(cooldownRows[0].created_at);
            const now = new Date();
            const diffSeconds = (now - lastCommentTime) / 1000;

            if (diffSeconds < 30) {
                const waitSeconds = Math.ceil(30 - diffSeconds);
                return res.status(429).json({
                    message: `Yeni bir yorum yapmadan önce ${waitSeconds} saniye bekleyin.`,
                });
            }
        }

        const [spamRows] = await db.query(
            "SELECT COUNT(*) AS count FROM comments WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)",
            [userId]
        );

        if (spamRows[0].count >= 10) {
            const banUntil = new Date(Date.now() + 60 * 60 * 1000);
            await db.query("UPDATE users SET banned_until = ? WHERE id = ?", [
                banUntil,
                userId,
            ]);
            return res.status(403).json({
                message: "5 dakika içinde çok fazla yorum yaptınız. 1 saatliğine yasaklandınız.",
            });
        }

        next();
    } catch (err) {
        console.error("Comment rate limit hatası:", err);
        return res.status(500).json({ message: "Rate limit kontrolü sırasında hata oluştu." });
    }
};
