const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/authMiddleware");
const commentRateLimit = require("../middlewares/commentRateLimit");

router.post("/:postId", auth, commentRateLimit, commentController.createComment);
router.get("/:postId", commentController.getCommentsByPost);
router.delete("/:id", auth, commentController.deleteComment);
router.put("/:id", auth, commentController.updateComment);
router.post("/:postId/comments/:parentId/reply", auth, commentRateLimit, commentController.replyToComment);
router.get("/post/:postId", commentController.getCommentsByPost);

module.exports = router;