const db = require("../config/db");

exports.togglePostLike = async (userId, postId, type) => {
    if (!['like', 'dislike'].includes(type)) {
        throw new Error("Geçersiz işlem tipi!");
    }

    const [existingLike] = await db.query(
        "SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?", [userId, postId]
    );

    if (existingLike.length > 0) {
        const currentType = existingLike[0].type;

        if (currentType === type) {
            await db.query("DELETE FROM post_likes WHERE user_id=? AND post_id = ?", [userId, postId]);
            return { message: "Beğeni geri alındı", action: 'removed' };
        } else {
            await db.query("UPDATE post_likes SET type = ? WHERE user_id = ? AND post_id = ?", [type, userId, postId]);
            return { message: "Beğeni güncellendi", action: 'updated' };
        }
    } else {
        await db.query("INSERT INTO post_likes (user_id, post_id, type) VALUES(?,?,?)", [userId, postId, type]);
        return { message: "Beğeni eklendi", action: 'added' };
    }
};
