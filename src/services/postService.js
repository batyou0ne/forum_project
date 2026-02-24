const db = require("../config/db");

exports.addPost = async (userId, title, content) => {
    const sql = `
      INSERT INTO posts (user_id, title, content)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [userId, title, content]);
    return result;
};

exports.getPosts = async (page, limit, search) => {
    const offset = (page - 1) * limit;
    let sql, countSql, params, countParams;

    if (search) {
        const searchTerm = `%${search}%`;
        sql = `
        SELECT posts.id, posts.title, posts.content, posts.created_at, users.username,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'like') AS like_count,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'dislike') AS dislike_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.title LIKE ? OR posts.content LIKE ?
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?;
      `;
        params = [searchTerm, searchTerm, limit, offset];
        countSql = `SELECT COUNT(*) as total FROM posts WHERE title LIKE ? OR content LIKE ?`;
        countParams = [searchTerm, searchTerm];
    } else {
        sql = `
        SELECT posts.id, posts.title, posts.content, posts.created_at, users.username,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'like') AS like_count,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id AND type = 'dislike') AS dislike_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?;
      `;
        params = [limit, offset];
        countSql = `SELECT COUNT(*) as total FROM posts`;
        countParams = [];
    }

    const [posts] = await db.query(sql, params);
    const [countResult] = await db.query(countSql, countParams);

    const totalPosts = countResult[0].total;
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    return { page, totalPages, totalPosts, posts };
};

exports.fetchPostById = async (postId) => {
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
        throw new Error("Post not found");
    }

    return results[0];
};

exports.removePost = async (postId, userId, role) => {
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
        throw new Error("You are not allowed to delete this post");
    }

    return true;
};

exports.editPost = async (postId, userId, title, content) => {
    const sql =
        `
      UPDATE posts
      SET title = ?, content = ?
      WHERE id = ? AND user_id = ?
    `
    const [result] = await db.query(sql, [title, content, postId, userId]);

    if (result.affectedRows === 0) {
        throw new Error("You are not allowed to update this post.");
    }

    return true;
};
