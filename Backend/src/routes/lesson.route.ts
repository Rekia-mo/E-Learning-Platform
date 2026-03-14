import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { upload } from "../middlewares/uploads";
const router = express.Router();
import { createLesson, deleteLessonTeacher, getLessonsByCourse, getLessonsBylessonId, deleteLessonByAdmin, updateLesson } from "../controllers/lesson.controller";
import { createLessonSchema } from "../models/Lesson.Model";


//CREATE LESSON (TEACHER)
router.post("/:id/lessons", authenticateToken, authorize(["Teacher"]), validate(createLessonSchema), createLesson);

//GET ALL LESSONS OF A COURSE 
router.get("/:id/lessons",authenticateToken, getLessonsByCourse);

//GET LESSON BY ID
router.get("/lessons/:id", authenticateToken, getLessonsBylessonId);

//UPDATE LESSON (TEACHER)
router.put("/lessons/:id", authenticateToken, authorize(["Teacher"]), updateLesson); 

//DELETE LESSON (TEACHER)
router.delete("/lessons/:id", authenticateToken, authorize(["Teacher"]), deleteLessonTeacher);

//DELETE LESSON (ADMIN)
router.delete("/lessons/:id/admin", authenticateToken, authorize(["Admin"]), deleteLessonByAdmin);

export default router;