import express from "express";
import cors from "cors";
import userRoutes from "../routes/user.route";
import authRoutes from "../routes/auth.route";
import teacherRoutes from "../routes/teacher.route";
import categorieRoutes from "../routes/category.route";
import postRoutes from "../routes/post.route";
import postCommentRoutes from "../routes/post-comment.route";
import { errorHandler } from "../middlewares/ErrorHandling";

export function setupRoutes(app: express.Application) {
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/teachers", teacherRoutes);
  app.use("/api/categories", categorieRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/comments", postCommentRoutes);
  app.use(errorHandler);
}
