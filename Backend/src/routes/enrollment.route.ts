import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  getMyEnrollments,
  getEnrollmentByCourseId,
  getEnrollmentByUserId,
  createEnrollmentHandler,
  deleteEnrollment,
} from "../controllers/enrollment.controller";

const router = express.Router();

// get all my enrollments
router.get("/me", authenticateToken, getMyEnrollments);

// get enrollment by course id
router.get("/course/:course_id", authenticateToken, getEnrollmentByCourseId);

// get enrollment by user id (admin only)
router.get("/user/:user_id", authenticateToken, authorize(["Admin"]), getEnrollmentByUserId);

// create enrollment
router.post("/:course_id", authenticateToken, createEnrollmentHandler);

// delete enrollment
router.delete("/:course_id", authenticateToken, deleteEnrollment);

export default router;