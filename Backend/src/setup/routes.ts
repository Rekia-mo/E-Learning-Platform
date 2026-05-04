import express from "express";
import cors from "cors";
import userRoutes from "../routes/user.route";
import authRoutes from "../routes/auth.route";
import teacherRoutes from "../routes/teacher.route";
import categorieRoutes from "../routes/category.route";
import postRoutes from "../routes/post.route";
import postCommentRoutes from "../routes/post-comment.route";
import courseRoutes from "../routes/course.route";
import lessonRoutes from "../routes/lesson.route";
import courseCommentRoutes from "../routes/course-comment.route";
import savedCourseRoutes from "../routes/saved-course.route";
import enrollmentRoutes from "../routes/enrollment.route";
import quizeRoutes from "../routes/quize.route";
import recommendationRoutes from "../routes/recommendation.route";
import { errorHandler } from "../middlewares/ErrorHandling";


export function setupRoutes(app: express.Application) {
  app.use(cors());
  app.use(express.json({ limit: "500mb" }));
  app.use(express.urlencoded({ limit: "500mb", extended: true }));

  app.use("/uploads", express.static("uploads"));
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/teachers", teacherRoutes);
  app.use("/api/categories", categorieRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/comments", postCommentRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/courses", lessonRoutes)
  app.use("/api/course-comments", courseCommentRoutes);
  app.use("/api/saved-courses", savedCourseRoutes);
  app.use("/api/enrollments", enrollmentRoutes);
  app.use("/api/quizes", quizeRoutes);
  app.use("/api/recommendations", recommendationRoutes);
  app.use(errorHandler);
}
