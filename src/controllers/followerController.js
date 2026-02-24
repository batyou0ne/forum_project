const followerService = require("../services/followerService");

exports.toggleFollow = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.id;

        const result = await followerService.toggleFollowUser(followerId, followingId);
        return res.json(result);
    } catch (error) {
        if (error.message === "Kendinizi takip edemezsiniz") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Takip hatası:", error);
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const userId = req.params.id;
        const followers = await followerService.getFollowersList(userId);
        return res.json(followers);
    } catch (error) {
        console.error("Takipçi getirme hatası:", error);
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const following = await followerService.getFollowingList(userId);
        return res.json(following);
    } catch (error) {
        console.error("Takip edilenleri getirme hatası:", error);
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};