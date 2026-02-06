const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/authMiddleware");

router.post("/:postId", auth, commentController.createComment);
router.get("/:postId", commentController.getCommentsByPost);
router.delete("/:id", auth, commentController.deleteComment);
router.put("/:id",auth, commentController.updateComment);
router.post("/:postId/comments/:parentId/reply", auth, commentController.replyToComment);
router.get("/post/:postId", commentController.getCommentsByPost);

module.exports = router;