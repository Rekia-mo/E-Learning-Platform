import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getMyPosts,
  likePost,
  deletePostByAdmin,
} from "../controllers/post.controller";

const router = express.Router();

// CREATE post
router.post("/", authenticateToken, createPost);

// GET all posts
router.get("/", authenticateToken, getPosts);

// GET MY posts
router.get("/my", authenticateToken, getMyPosts);

// UPDATE post by id
router.put(
  "/:id",
  authenticateToken,
  authorize(["Student", "Teacher"]),
  updatePost,
);

// DELETE post by id
router.delete(
  "/:id",
  authenticateToken,
  authorize(["Student", "Teacher"]),
  deletePost,
);

// DELETE post by id (Admin)
router.delete(
  "/:id/admin",
  authenticateToken,
  authorize(["Admin"]),
  deletePostByAdmin,
);

// PATCH LIKE
router.patch("/:id/like", authenticateToken, likePost);

export default router;
