const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.delete("/:id", auth, postController.deletePost);
router.put("/:id", auth, postController.updatePost);

module.exports = router;
