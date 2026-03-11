import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  getMySavedCourses,
  createSavedCourse,
  deleteSavedCourse,
} from "../controllers/saved-course.controller";

const router = express.Router();

// GET all my saved courses
router.get(
  "/me",
  authenticateToken,
  authorize(["Student", "Admin"]),
  getMySavedCourses,
);

// SAVE a course
router.post("/", authenticateToken, authorize(["Student"]), createSavedCourse);

// DELETE saved course
router.delete(
  "/:course_id",
  authenticateToken,
  authorize(["Student"]),
  deleteSavedCourse,
);

export default router;
