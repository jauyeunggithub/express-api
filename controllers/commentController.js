const Comment = require("../models/comment");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");

exports.createComment = async (req, res) => {
  try {
    const {
      content,
      commentableType,
      commentableId: incomingCommentableId,
    } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];

    let userId;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT_SECRET environment variable is not set!");
        return res.status(500).json({
          message: "Server configuration error: JWT secret not found.",
        });
      }
      const decodedToken = jwt.verify(token, jwtSecret);
      userId = decodedToken.userId;
    } catch (tokenError) {
      console.error("JWT verification error:", tokenError);
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    let actualCommentableId = incomingCommentableId;

    if (commentableType === "Post") {
      const post = await Post.findByPk(incomingCommentableId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "Post not found for commenting." });
      }
      actualCommentableId = post.id;
    } else {
      console.warn(`Unknown or unhandled commentableType: ${commentableType}`);
    }

    const comment = await Comment.create({
      content,
      commentableId: actualCommentableId,
      commentableType,
      UserId: userId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(400)
      .json({ message: "Error creating comment", error: error.message });
  }
};

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
