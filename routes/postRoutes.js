// routes/postRoutes.js
const express = require("express");
const {
  createPost,
  getAllPosts,
  getPostById,
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Define routes for Post CRUD
router.post("/", createPost); // Create a post
router.get("/", getAllPosts); // Get all posts
router.get("/:id", getPostById); // Get post by ID

module.exports = router;
