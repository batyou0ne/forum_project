const db = require("../config/db");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const sql = `
      INSERT INTO posts (user_id, title, content)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [userId, title, content]);

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
    const offset = (page - 1) * limit;

    const sql =
      `
      SELECT posts.id, posts.title, posts.content, posts.created_at, users.username,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'like') AS like_count,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'dislike') AS dislike_count
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
      LIMIT ? OFFSET ?;
    `

    const [posts] = await db.query(sql, [limit, offset]);

    const [countResult] = await db.query(`SELECT COUNT(*) as total FROM posts`);

    const totalPosts = countResult[0].total;
    const totalPages = Math.ceil(totalPosts / limit);

    return res.json({ page, totalPages, totalPosts, posts })

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    return res.status(500).json({ message: err.message });

  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const sql = `
        SELECT posts.id,posts.user_id, posts.title, posts.content, posts.created_at, users.username,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'like') AS like_count,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'dislike') AS dislike_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `

    const [results] = await db.query(sql, [postId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(results[0])

  } catch (error) {
    console.error("GET POST BY ID ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    let sql;
    let params;

    if (role === "admin") {
      sql = `DELETE FROM posts WHERE id = ?`;
      params = [postId];
    } else {
      sql = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
      params = [postId, userId]
    }

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "You are not allowed to delete this post"
      });
    }

    return res.json({ message: "Post deleted successfully" });

  } catch (err) {
    console.error("DELETE POST ERROR:", err);
    return res.status(500).json({
      message: "Post could not be deleted"
    });
  }
};


exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    const sql =
      `
      UPDATE posts
      SET title = ?, content = ?
      WHERE id = ? AND user_id = ?
    `
    const [result] = await db.query(sql, [title, content, postId, userId]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "You are not allowed to update this post." });
    }

    return res.json({ message: "Post is updated successfully!" });

  } catch (err) {
    return res.status(500).json({ message: "Post could not be updated." })
  }
};