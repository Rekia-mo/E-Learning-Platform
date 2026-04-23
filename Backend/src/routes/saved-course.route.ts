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
  getMySavedCourses,
);

// SAVE a course
router.post(
  "/:course_id",
  authenticateToken,
  createSavedCourse,
);

// DELETE saved course
router.delete(
  "/:course_id",
  authenticateToken,
  deleteSavedCourse,
);

export default router;
