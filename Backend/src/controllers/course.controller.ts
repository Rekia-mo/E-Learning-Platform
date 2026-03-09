import { Request, Response } from "express";
import { Course, Teacher, Category } from "../models/index";

interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  document?: string | null;
  image_url?: string;
  isSpecialized: boolean;
  teacher_id: string;
  categorie_id: string;
}

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

//CREAT NEW COURSE (TEACHER)
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user_id = req.user.id;

    //CHECK IF TEACHER PROFILE EXISTS FOR THE USER
    const teacher = await Teacher.findOne({
      where: { user_id }
    });

    if (!teacher) return res.status(400).json({ message: "Teacher profile not found for this user" });
    const teacher_id = teacher.id;

    const { title, description, isSpecialized, categorie_id } = req.body as CourseAttributes;

    const course = await Course.create({
      title,
      description,
      isSpecialized,
      document: req.file ? req.file.path : null,
      image_url: req.file ? req.file.path : null,
      categorie_id,
      teacher_id
    });

    res.json({
      success: true,
      course
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//GET COURSES BY TEACHER ID 


//GET COURSES BY CATEGORY ID


//GET COURSES BY isSpecialized


//GET COURSES BY COURSE ID


//GET MY COURSES 


//GET ALL COURSES
export const getCourses = async (req: Request, res: Response) => {
  try {

    const { teacher_id, category_id, isSpecialized } = req.query;

    let filter: any = {};
    
    if (teacher_id) {
      filter.teacher_id = Number(teacher_id);
    }

    if (category_id) {
      filter.category_id = Number(category_id);
    }

    if (isSpecialized !== undefined) {
      filter.isSpecialized = isSpecialized === "true";
    }
    console.log("FILTER:", filter);

    const courses = await Course.findAll({
      where: filter,
      include: [
        {
          model: Teacher
        },
        {
          model: Category,
          attributes: ["name"]
        }
      ]
    });

    res.json({
      success: true,
      courses
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

//UPDATE COURSE (TEACHER)
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {

    //get the Course id from the request params
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;

    //find the Course by id
    let course = await Course.findByPk(userId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { title, description, isSpecialized, image_url, categorie_id } = req.body;

    //update the Course's attributes
    let updatedCourse = await Course.update({ title, description, isSpecialized, image_url, categorie_id }, { where: { id: userId } });

    res.json({
      updatedCourse,
      success: true,
      message: "Course role updated successfully"
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//DELETE COURSE (me TEACHER + ADMIN)
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {

    //get the Course id from the request params (DELTE BY ID)
    const course_id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!course_id) {
      res.json({ message: "No Course ID provided" });
    };

    //find the Course by id
    const CourseInstance = await Course.findByPk(course_id);
    if (!CourseInstance) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user_id = req.user.id;

    //CHECK IF TEACHER PROFILE EXISTS FOR THE USER
    const teacher = await Teacher.findOne({
      where: { user_id }
    });

    if (!teacher) return res.status(400).json({ message: "Teacher profile not found for this user" });

    if (CourseInstance.teacher_id !== teacher.id) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own courses" });
    }

    //delete the Course
    await CourseInstance.destroy();
    res.json({ message: "Course deleted successfully" });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }

}
