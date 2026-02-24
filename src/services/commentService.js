const db = require("../config/db");

exports.addComment = async (postId, userId, content) => {
    const sql = `
        INSERT INTO comments (post_id, user_id, content)
        VALUES(?,?,?)
    `;
    const [result] = await db.query(sql, [postId, userId, content]);
    return result.insertId;
};

exports.fetchCommentsTree = async (postId) => {
    const sql = `
        SELECT comments.id, comments.post_id, comments.parent_id, comments.user_id, comments.content, comments.created_at, users.username
        FROM comments
        LEFT JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    `;

    const [rows] = await db.query(sql, [postId]);

    const commentMap = {};
    const rootComments = [];

    rows.forEach(row => {
        commentMap[row.id] = {
            id: row.id,
            post_id: row.post_id,
            parent_id: row.parent_id,
            user_id: row.user_id,
            username: row.username,
            content: row.content,
            created_at: row.created_at,
            replies: []
        };
    });

    rows.forEach(row => {
        if (row.parent_id !== null && commentMap[row.parent_id]) {
            commentMap[row.parent_id].replies.push(commentMap[row.id]);
        } else if (row.parent_id === null) {
            rootComments.push(commentMap[row.id]);
        }
    });

    return rootComments;
};

exports.removeComment = async (commentId, userId, role) => {
    let sql;
    let params;

    if (role === "admin") {
        sql = `DELETE FROM comments WHERE id = ?`;
        params = [commentId];
    } else {
        sql = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
        params = [commentId, userId];
    }

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
        throw new Error("You are not allowed to delete this comment.");
    }

    return true;
};

exports.updateCommentContent = async (commentId, userId, content) => {
    const sql = `
        UPDATE comments
        SET content = ?
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(sql, [content, commentId, userId]);

    if (result.affectedRows === 0) {
        throw new Error("You are not allowed to update this comment.");
    }

    return true;
};

exports.addReply = async (postId, parentId, userId, content) => {
    const sql = `
        INSERT INTO comments (post_id, parent_id, user_id, content)
        VALUES (?,?,?,?)
    `;
    const [result] = await db.query(sql, [postId, parentId, userId, content]);
    return result.insertId;
};