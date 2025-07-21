// routes/commentRoutes.js
const express = require("express");
const {
  createComment,
  getCommentsByPostId,
} = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Define routes for Comment CRUD
router.post("/", createComment); // Create a comment
router.get("/:postId", getCommentsByPostId); // Get comments for a post

module.exports = router;
