import { Request, Response } from "express";
import { Course, Lesson, Teacher } from "../models/index";


interface LessonAttributes {
  id: string;
  title: string;
  description?: string | null;
  vedio_url: string;
  order_index: number;
  course_id: string;
}

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

//CREATE LESSON (TEACHER)
export const createLesson = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const course_id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, description, order_index } = req.body as LessonAttributes;

    if (!req.file) {
      return res.status(400).json({ message: "Video is required" });
    }
    const vedio_url = req.file.path ;

    // find teacher linked to this user
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher) {
      return res.status(403).json({ message: "You are not a teacher" });
    }

    // check if course belongs to this teacher
    const course = await Course.findOne({
      where: {
        id: course_id,
        teacher_id: teacher.id
      }
    });

    if (!course) {
      return res.status(403).json({
        message: "You are not allowed to modify this course"
      });
    }

    // create lesson
    const lesson = await Lesson.create({
      title,
      description,
      vedio_url,
      order_index,
      course_id
    });

    res.json({
      success: true,
      lesson
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//GET ALL LESSONS OF COURSE
export const getLessonsByCourse = async (req: Request<{ id: string }>, res: Response) => {
  try {

    const course_id = req.params.id;

    if (!course_id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const lessons = await Lesson.findAll({
      where: { course_id },
      order: [["order_index", "ASC"]],
      include: [
        {
          model: Course
        }
      ]
    });

    if (lessons.length === 0) {
      return res.status(404).json({ message: "No lessons found for this course" });
    }

     // Add base URL to cv_URL to make it accessible  
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const lessonsWithVideos = lessons.map(lesson => ({
      ...lesson.toJSON(),
      vedio_url: lesson.vedio_url ? `${baseURL}/${lesson.vedio_url.replace(/\\/g, "/")}` : null
    }));

    res.json({
      success: true,
      lessons: lessonsWithVideos
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//GET LESSON BY ID
export const getLessonsBylessonId = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const lesson_id = req.params.id;

    const lesson = await Lesson.findByPk(lesson_id, {
      include: [
        {
          model: Course,
        }]
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({
      success: true,
      lesson
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//UPDATE LESSON (TEACHER)
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const lesson_id = req.params.id;

    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher) {
      return res.status(403).json({ message: "You are not a teacher" });
    }

    const lesson = await Lesson.findOne({
      where: { id: lesson_id },
      include: [{
        model: Course,
        where: { teacher_id: teacher.id }
      }]
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found or not yours" });
    }

    await lesson.update(req.body);

    return res.json({
      message: "Lesson updated successfully",
      lesson
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//DELETE LESSON (TEACHER)
export const deleteLessonTeacher = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher) {
      return res.status(403).json({ message: "You are not a teacher" });
    }

    const lesson_id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    let lesson = await Lesson.findByPk(lesson_id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await Course.findByPk(lesson.course_id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher_id !== teacher.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this lesson"
      });
    }

    lesson = await Lesson.findOne({
      where: {
        id: lesson_id,
        course_id: course.id
      }
    });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found in this course" });
    }

    await lesson.destroy();

    return res.json({
      success: true,
      message: "Lesson deleted successfully"
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//DELETE LESSON (ADMIN)
export const deleteLessonByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    //get the Lesson id from the request params (DELTE BY ID)
    const lesson_id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!lesson_id) {
      res.json({ message: "No Lesson ID provided" });
    };

    //find the Lesson by id
    const lessonInstance = await Lesson.findByPk(lesson_id);
    if (!lessonInstance) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    //delete the Lesson
    await lessonInstance.destroy();
    res.json({ message: "Lesson deleted successfully" });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }

}
