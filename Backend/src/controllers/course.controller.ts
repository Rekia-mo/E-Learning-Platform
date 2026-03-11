import { Request, Response } from "express";
import { Course, Teacher, Category } from "../models/index";
import { is } from "zod/v4/locales";

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

    const files = req.files as {
      image_url?: Express.Multer.File[];
      document?: Express.Multer.File[];
    };

    const imagePath = files?.image_url?.[0]?.path || null;
    const documentPath = files?.document?.[0]?.path || null;

    let { title, description, isSpecialized, categorie_id } = req.body as CourseAttributes;

    if (!isSpecialized) isSpecialized = false;

    const course = await Course.create({
      title,
      description,
      isSpecialized,
      document: documentPath,
      image_url: imagePath,
      categorie_id,
      teacher_id: teacher.id,
      likes: 0
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

//GET MY COURSES 
export const getMyCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user_id = req.user.id;

    //chetk if teacher profile exists for the user
    const teacher = await Teacher.findOne({
      where: { user_id }
    })

    if (!teacher) return res.status(404).json({ message: "Teacher profile not found for this user" });

    const courses = await Course.findAll({
      where: { teacher_id: teacher.id },
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

    const baseURL = `${req.protocol}://${req.get("host")}`;

    const courseWithUrls = courses.map(course => ({
      ...course.toJSON(),
      image_url: course.image_url ? `${baseURL}/${course.image_url.replace(/\\/g, "/")}` : null,
      document: course.document ? `${baseURL}/${course.document.replace(/\\/g, "/")}` : null
    }));

    res.json({
      success: true,
      courses: courseWithUrls
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//GET ALL COURSES
export const getCourses = async (req: Request, res: Response) => {
  try {

    const { teacher_id, categorie_id, isSpecialized } = req.query;

    let filter: any = {};

    if (teacher_id) {
      filter.teacher_id = teacher_id;
    }

    if (categorie_id) {
      filter.categorie_id = categorie_id;
    }

    if (isSpecialized !== undefined) {
      filter.isSpecialized = isSpecialized === "true";
    }

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
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const courseWithUrls = courses.map(course => ({
      ...course.toJSON(),
      image_url: course.image_url ? `${baseURL}/${course.image_url.replace(/\\/g, "/")}` : null,
      document: course.document ? `${baseURL}/${course.document.replace(/\\/g, "/")}` : null
    }));

    res.json({
      success: true,
      courses: courseWithUrls
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

//GET COURCE BY ID
export const getCourseById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "No course ID provided" });

    const course = await Course.findByPk(req.params.id, {
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

    if (!course) return res.status(404).json({ message: "course not found" });

    const baseURL = `${req.protocol}://${req.get("host")}`;

    const courseWithUrls = {
      ...course.toJSON(),
      image_url: course.image_url ? `${baseURL}/${course.image_url.replace(/\\/g, "/")}` : null,
      document: course.document ? `${baseURL}/${course.document.replace(/\\/g, "/")}` : null
    };

    res.json({
      success: true,
      courses: courseWithUrls
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
}

//UPDATE COURSE (TEACHER)
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const courseId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // find teacher profile
    const teacher = await Teacher.findOne({
      where: { user_id: userId }
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    // find the course
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check ownership
    if (course.teacher_id !== teacher.id) {
      return res.status(403).json({ message: "You cannot update this course" });
    }

    const { title, description, isSpecialized, image_url, categorie_id } = req.body;

    await course.update({
      ...(title && { title }),
      ...(description && { description }),
      ...(isSpecialized !== undefined && { isSpecialized }),
      ...(image_url && { image_url }),
      ...(categorie_id && { categorie_id })
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      course
    });

  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//DELETE COURS BY (ADMIN)
export const deleteCourseByAdmin = async (req: AuthRequest, res: Response) => {
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

    //delete the Course
    await CourseInstance.destroy();
    res.json({ message: "Course deleted successfully" });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }

}

//DELETE COURSE (me TEACHER)
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

//ADD LIKES
export const likeCourse = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // Récupérer l'id du Course
    const id = req.params.id;

    const course = await Course.findByPk(id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Incrémenter le nombre de likes
    await course.increment("likes");
    await course.reload();


    // Retourner toutes les données du Course
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
