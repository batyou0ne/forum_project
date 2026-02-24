const db = require("../config/db");

exports.toggleFollowUser = async (followerId, followingId) => {
    if (followerId == followingId) {
        throw new Error("Kendinizi takip edemezsiniz");
    }

    const [existing] = await db.query(
        "SELECT id FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, followingId]
    );

    if (existing.length > 0) {
        await db.query(
            "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
            [followerId, followingId]
        );
        return { following: false };
    } else {
        await db.query(
            "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
            [followerId, followingId]
        );
        return { following: true };
    }
};

exports.getFollowersList = async (userId) => {
    const [rows] = await db.query(
        `SELECT users.id, users.username
         FROM follows
         JOIN users ON follows.follower_id = users.id
         WHERE follows.following_id = ?`,
        [userId]
    );
    return rows;
};

exports.getFollowingList = async (userId) => {
    const [rows] = await db.query(
        `SELECT users.id, users.username
         FROM follows
         JOIN users ON follows.following_id = users.id
         WHERE follows.follower_id = ?`,
        [userId]
    );
    return rows;
};
