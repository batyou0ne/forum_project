const likeService = require("../services/likeService");

exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const { type } = req.body;
        const userId = req.user.id;

        const result = await likeService.togglePostLike(userId, postId, type);

        return res.status(
            result.action === 'added' ? 201 : 200
        ).json(result);

    } catch (error) {
        if (error.message === "Geçersiz işlem tipi!") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Beğeni Sistemi Hatası: ", error);
        res.status(500).json({ message: "Sunucu hatası oluştu" });
    }
};