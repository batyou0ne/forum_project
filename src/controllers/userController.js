const userService = require("../services/userService");

exports.getUserProfile = async (req, res) => {
    try {
        console.log("getUserProfile called. User ID from token:", req.user?.id);
        const userId = req.user.id;

        const profileData = await userService.getUserProfileData(userId);
        res.status(200).json(profileData);

    } catch (error) {
        if (error.message === "Kullanıcı bulunamadı") {
            return res.status(404).json({ message: error.message });
        }
        console.error("Profil Çekme Hatası:", error);
        res.status(500).json({
            message: "Sunucu hatası oluştu.",
            error: error.message,
            stack: error.stack
        });
    }
};