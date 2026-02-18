const db = require("../config/db");

exports.toggleFollow = async (req, res) => {
    const followerId = req.user.id; //biz, tokendan geliyor

    const followingId = req.params.id; //takip etmek istediğimiz kişi, url'den geliyor

    if (followerId == followingId) {
        return res.status(400).json({ message: "Kendinizi takip edemezsiniz" })
    };

    const [existing] = await db.query("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?", [followerId, followingId]);

    if (existing.length > 0) {
        await db.query("DELETE FROM follows WHERE follower_id = ? AND following_id = ?", [followerId, followingId]);
        return res.json({ following: false })
    } else {
        await db.query("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)", [followerId, followingId]);
        return res.json({ following: true });
    }


};

exports.getFollowers = async (req, res) => {
    const userId = req.params.id;

    const [rows] = await db.query(
        `SELECT users.id, users.username
         FROM follows
         JOIN users ON follows.following_id = users.id
         WHERE follows.follower_id = ?
        `, [userId]);

    res.json(rows);
};

exports.getFollowing = async (req, res) => {
    const userId = req.params.id;

    const [rows] = await db.query(
        `SELECT users.id, users.username
     FROM follows
     JOIN users ON follows.following_id = users.id
     WHERE follows.follower_id = ?`,
        [userId]
    );
    res.json(rows);
};