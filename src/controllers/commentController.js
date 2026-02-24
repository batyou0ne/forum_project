const commentService = require("../services/commentService");

exports.createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const { content } = req.body;

        const commentId = await commentService.addComment(postId, userId, content);

        return res.status(201).json({
            message: "Comment created successfully!",
            commentId: commentId
        });

    } catch (err) {
        console.error("Error creating comment:", err);
        return res.status(500).json({ message: "Comment could not be created!", error: err.message });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const rootComments = await commentService.fetchCommentsTree(postId);

        return res.json(rootComments);

    } catch (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ message: "Comments could not be fetched!", error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const role = req.user.role;

        await commentService.removeComment(commentId, userId, role);

        return res.json({ message: "Comment has been deleted successfully!" });
    } catch (err) {
        if (err.message === "You are not allowed to delete this comment.") {
            return res.status(403).json({ message: err.message });
        }
        return res.status(500).json({ message: "Comment could not be deleted." });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;

        await commentService.updateCommentContent(commentId, userId, content);

        return res.json("Comment has updated successfully!");

    } catch (err) {
        if (err.message === "You are not allowed to update this comment.") {
            return res.status(403).json({ message: err.message });
        }
        return res.status(500).json({ message: "Comment could not be updated." });
    }
};

exports.replyToComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const parentId = req.params.parentId;
        const userId = req.user.id;
        const { content } = req.body;

        await commentService.addReply(postId, parentId, userId, content);

        return res.status(201).json({ message: "Reply created." });

    } catch (err) {
        return res.status(500).json({ message: "Reply could not be created." });
    }
};