import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import{ createCourse, deleteCourse, getCourses, updateCourse, getMyCourses, likeCourse, deleteCourseByAdmin, getCourseById } from "../controllers/course.controller"; 
import { CreateCourseSchema } from "../models/Course.Model";
import { upload } from "../middlewares/uploads";
const router = express.Router();

//CREAT NEW COURSE (TEACHER)
router.post('/', authenticateToken, authorize(['Teacher']), upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "document", maxCount: 1 }
  ]), validate(CreateCourseSchema),createCourse);

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
router.put('/:id', authenticateToken, authorize(['Teacher']),  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "document", maxCount: 1 }
  ]), updateCourse);

//pach like 
router.patch('/:id/like', authenticateToken, likeCourse);

export default router;