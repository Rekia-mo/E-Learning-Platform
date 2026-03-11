import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import{ createCourse, deleteCourse, getCourses, updateCourse, getMyCourses, likeCourse, deleteCourseByAdmin, getCourseById } from "../controllers/course.controller"; 
import { CreateCourseSchema } from "../models/Course.Model";
const router = express.Router();

//CREAT NEW COURSE (TEACHER)
router.post('/', validate(CreateCourseSchema), authenticateToken, authorize(['Teacher']), createCourse);

//DELETE COURSE (TEACHER)
router.delete('/:id', authenticateToken, authorize(['Teacher']), deleteCourse);

//DELETE COURSE(ADMIN)
router.delete('/:id/admin', authenticateToken, authorize(['Admin']), deleteCourseByAdmin);

//GET ALL COURSES
router.get('/', authenticateToken, getCourses);

//GET MY COURSES (TEACHER)
router.get('/my-courses', authenticateToken, authorize(['Teacher']), getMyCourses);

//GET COURSES BY ID
router.get('/:id', authenticateToken, getCourseById);

//update course (TEACHER)
router.put('/:id', authenticateToken, authorize(['Teacher']), updateCourse);

//pach like 
router.patch('/:id/like', authenticateToken, likeCourse);

export default router;