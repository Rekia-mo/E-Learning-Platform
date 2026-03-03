import express from "express";
import { createTeacher, getAllTeachers, getTeacherById, deleteTeacher, updateTeacherStatus } from "../controllers/teacher.controller";
import { teacherSchema }from "../models/Teacher.Model";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { authorize } from "../middlewares/role.middelware";

const router = express.Router();

//POST NEW TEACHER
router.post("/", validate(teacherSchema), authenticateToken, createTeacher);

//get all teachers (ADMIN ONLY)
router.get("/", authenticateToken, authorize(["Admin"]), getAllTeachers);

//GET TEACHER BY ID (ADMIN ONLY)
router.get("/:id", authenticateToken, authorize(["Admin"]), getTeacherById);
  
//DELETE TEACHER (ADMIN ONLY)
router.delete("/:id", authenticateToken, authorize(["Admin"]), deleteTeacher);

//UPDATE TEACHER STATUS (ADMIN ONLY)
router.patch("/:id/status", authenticateToken, authorize(["Admin"]), updateTeacherStatus);

export default router;
