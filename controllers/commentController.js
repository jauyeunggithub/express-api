// controllers/commentController.js
const Comment = require("../models/comment");
const Post = require("../models/post");

// Create a new comment for a post
exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({ content, postId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all comments for a post
exports.getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
    });
    if (comments.length === 0)
      return res.status(404).json({ message: "No comments found" });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
