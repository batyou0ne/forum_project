const express = require("express");
const router = express.Router();

const followController = require("../controllers/followerController");

const auth = require("../middlewares/authMiddleware");

router.post("/:id/follow", auth, followController.toggleFollow);
router.get("/:id/followers", followController.getFollowers);
router.get("/:id/following", followController.getFollowing);

module.exports = router;