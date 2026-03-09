import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import{ createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller"; 
import { CreateCourseSchema } from "../models/Course.Model";
const router = express.Router();

//CREAT NEW COURSE (TEACHER)
router.post('/', validate(CreateCourseSchema), authenticateToken, authorize(['Teacher']), createCourse);

//DELETE COURSE (TEACHER)
router.delete('/:id', authenticateToken, authorize(['Teacher']), deleteCourse);

//GET ALL COURSES
router.get('/', authenticateToken, getCourses);

//update course (TEACHER)
router.put('/:id', authenticateToken, authorize(['Teacher']), updateCourse);

export default router;