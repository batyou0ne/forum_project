const db = require("../config/db");

exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, type } = req.body;

        if (!['like', 'dislike'].includes(type)) {
            return res.status(400).json({ message: "Geçersiz işlem tipi!" });
        }

        const [existingLike] = await db.query(
            "SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?", [userId, postId]
        );

        if (existingLike.length > 0) {
            const currentType = existingLike[0].type;

            if (currentType === type) {
                await db.query("DELETE FROM post_likes WHERE user_id=? AND post_id = ?"), [userId, postId]
                return res.status(200).json({ message: "Beğeni geri alındı" })
            } else {
                await db.query("UPDATE FROM post_likes SET type = ?  WHERE user_id = ? AND post_id = ?"), [type, userId, postId];
            }
        } else {
            await db.query("INSERT INTO post_likes (user_id, post_id, type) VALUES(?,?,?) "), [userId, postId, type];
        }

    } catch (error) {
        console.error("Beğeni Sistemi Hatası: ", error);
        res.status(500).json({ message: "Sunucu hatası oluştu" })
    }
};