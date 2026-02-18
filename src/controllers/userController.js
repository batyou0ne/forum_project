const db = require("../config/db");

exports.getUserProfile = async (req, res) => {
    try {
        console.log("getUserProfile called. User ID from token:", req.user?.id);
        const userId = req.user.id;

        const [users] = await db.query(
            "SELECT id, username, email, created_at FROM users WHERE id = ?", [userId]
        );
        console.log("Database query result:", users);

        if (users.length === 0) {
            console.log("User not found in DB");
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
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

        res.status(200).json({
            userInfo: {
                ...user,
                followerCount,
                followingCount
            },
            userPosts: posts
        });

    } catch (error) {
        console.error("Profil Çekme Hatası:", error);
        res.status(500).json({
            message: "Sunucu hatası oluştu.",
            error: error.message,
            stack: error.stack
        });
    }
};