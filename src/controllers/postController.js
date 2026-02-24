const postService = require("../services/postService");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    await postService.addPost(userId, title, content);
    res.status(201).json({ message: "Post created" });

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Post could not be created" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search;

    const result = await postService.getPosts(page, limit, search);
    return res.json(result);

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postService.fetchPostById(postId);
    res.json(post);

  } catch (err) {
    if (err.message === "Post not found") {
      return res.status(404).json({ message: "Post not found" })
    }
    console.error("GET POST BY ID ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    await postService.removePost(postId, userId, role);
    return res.json({ message: "Post deleted successfully" });

  } catch (err) {
    if (err.message === "You are not allowed to delete this post") {
      return res.status(403).json({ message: err.message });
    }
    console.error("DELETE POST ERROR:", err);
    return res.status(500).json({ message: "Post could not be deleted" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    await postService.editPost(postId, userId, title, content);
    return res.json({ message: "Post is updated successfully!" });

  } catch (err) {
    if (err.message === "You are not allowed to update this post.") {
      return res.status(403).json({ message: err.message });
    }
    return res.status(500).json({ message: "Post could not be updated." })
  }
};