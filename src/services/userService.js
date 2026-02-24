const db = require("../config/db");

exports.getUserProfileData = async (userId) => {
    const [users] = await db.query(
        "SELECT id, username, email, created_at FROM users WHERE id = ?", [userId]
    );

    if (users.length === 0) {
        throw new Error("Kullanıcı bulunamadı");
    }

    const user = users[0];

    const [posts] = await db.query(
        "SELECT id, title, content, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );

    const [[{ followerCount }]] = await db.query(
        "SELECT COUNT(*) as followerCount FROM follows WHERE following_id = ?", [userId]
    );

    const [[{ followingCount }]] = await db.query(
        "SELECT COUNT(*) as followingCount FROM follows WHERE follower_id = ?", [userId]
    );

    return {
        userInfo: {
            ...user,
            followerCount,
            followingCount
        },
        userPosts: posts
    };
};
