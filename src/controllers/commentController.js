const db = require("../config/db");

exports.createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const { content } = req.body;

        const sql =
            `
            INSERT INTO comments (post_id, user_id, content)
            VALUES(?,?,?)
        `;

        const [result] = await db.query(sql, [postId, userId, content]);

        return res.status(201).json({ message: "Comment created successfully!", commentId: result.insertId });

    } catch (err) {
        console.error("Error creating comment:", err);
        return res.status(500).json({ message: "Comment could not be created!", error: err.message })
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const sql =
            `
            SELECT id, post_id, parent_id, user_id, content, created_at
            FROM comments
            WHERE post_id = ?
            ORDER BY created_at ASC
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
                content: row.content,
                created_at: row.created_at,
                //...row, bu yukarıdakileri tek tek yazmak yerine böyle de yazabiliyormuşuz
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

        return res.json(rootComments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ message: "Comments could not be fetched!", error: err.message })
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const role = req.user.role;


        let sql;
        let params;

        if (role === "admin") {
            sql = `
            DELETE FROM comments
            WHERE id = ?
        `;
            params = [commentId]
        } else {
            sql = `
            DELETE FROM comments
            WHERE id = ? AND user_id = ?
        `;
            params = [commentId, userId]
        }


        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "You are not allowed to  delete this comment." })
        }

        return res.json({ message: "Comment has deleted successfully!" })
    } catch (err) {
        return res.status(500).json({ message: "Comment could not be deleted." })
    }
};

exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body

        const sql =
            `
            UPDATE comments
            SET content = ?
            WHERE id = ? AND user_id = ?
        `;

        const [result] = await db.query(sql, [content, commentId, userId]);

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "You are not allowed to update this comment." })
        };

        return res.json("Comment has updated successfully!");

    } catch (err) {
        return res.status(500).json({ message: "Comment could not be updated." })
    }
};

exports.replyToComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const parentId = req.params.parentId;
        const userId = req.user.id;
        const { content } = req.body;

        const sql =
            `
            INSERT INTO comments (post_id, parent_id, user_id, content)
            VALUES (?,?,?,?)
        `

        const [result] = await db.query(sql, [postId, parentId, userId, content]);

        return res.status(201).json({ message: "Reply created." })

    } catch (err) {
        return res.status(500).json({ message: "Reply could not be created." })
    }
};