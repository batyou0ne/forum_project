const db = require("../config/db");

module.exports = async (req, res, next) => {
    const userId = req.user.id;

    try {
        // 1. Ban kontrolü
        const [banRows] = await db.query(
            "SELECT banned_until FROM users WHERE id = ?",
            [userId]
        );

        if (banRows.length > 0 && banRows[0].banned_until) {
            const bannedUntil = new Date(banRows[0].banned_until);
            if (bannedUntil > new Date()) {
                const remaining = Math.ceil((bannedUntil - new Date()) / 60000);
                return res.status(403).json({
                    message: `Spam nedeniyle yasaklandınız. ${remaining} dakika sonra tekrar deneyebilirsiniz.`,
                });
            }
        }

        // 2. Cooldown kontrolü: son 2 dakika içinde post attı mı?
        const [cooldownRows] = await db.query(
            "SELECT id FROM posts WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE) ORDER BY created_at DESC LIMIT 1",
            [userId]
        );

        if (cooldownRows.length > 0) {
            return res.status(429).json({
                message: "Çok hızlı! Her 2 dakikada bir post atabilirsiniz.",
            });
        }

        // 3. Spam kontrolü: son 10 dakikada 4'ten fazla post
        const [spamRows] = await db.query(
            "SELECT COUNT(*) AS count FROM posts WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)",
            [userId]
        );

        if (spamRows[0].count >= 4) {
            const banUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 saat
            await db.query("UPDATE users SET banned_until = ? WHERE id = ?", [
                banUntil,
                userId,
            ]);
            return res.status(403).json({
                message:
                    "10 dakika içinde çok fazla post attınız. 1 saatliğine yasaklandınız.",
            });
        }

        next();
    } catch (err) {
        console.error("Rate limit hatası:", err);
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};
