import { Request, Response } from "express";
import { Saved_Course, Course, User } from "../models/index";
import { z } from "zod";

// Interface pour récupérer les infos de l'utilisateur depuis le token
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ================================ ZOD SCHEMA ===============================

const createSavedCourseSchema = z.object({
  course_id: z.string().uuid("Course id invalide"),
});

// ================================ GET ALL MY SAVED COURSES =============================
// Récupérer tous les cours sauvegardés par l'utilisateur connecté

export const getMySavedCourses = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user!.id;

    const savedCourses = await Saved_Course.findAll({
      where: { user_id },
      include: [
        {
          model: Course,
          attributes: ["id", "title", "description", "image_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: savedCourses.length,
      data: savedCourses,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ CREATE SAVED COURSE ==============================
// Ajouter un cours dans les favoris via l'URL

export const createSavedCourse = async (req: AuthRequest, res: Response) => {
  try {
    // Récupérer course_id depuis l'URL
    const { course_id } = req.params;

    // Validation ZOD du paramètre course_id
    const validated = createSavedCourseSchema.parse({ course_id });

    const user_id = req.user!.id;

    // vérifier que le cours existe
    const course = await Course.findByPk(validated.course_id);

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // vérifier si le cours est déjà sauvegardé
    const alreadySaved = await Saved_Course.findOne({
      where: {
        user_id,
        course_id: validated.course_id,
      },
    });

    if (alreadySaved)
      return res.status(400).json({
        success: false,
        message: "Course already saved",
      });

    const savedCourse = await Saved_Course.create({
      user_id,
      course_id: validated.course_id,
    });

    return res.status(201).json({
      success: true,
      data: savedCourse,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

/*
// ================================ CREATE SAVED COURSE ==============================
// Ajouter un cours dans les favoris

export const createSavedCourse = async (req: AuthRequest, res: Response) => {
  try {
    const body = createSavedCourseSchema.parse(req.body);
    const user_id = req.user!.id;

    // vérifier que le cours existe
    const course = await Course.findByPk(body.course_id);

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // vérifier si le cours est déjà sauvegardé
    const alreadySaved = await Saved_Course.findOne({
      where: {
        user_id,
        course_id: body.course_id,
      },
    });

    if (alreadySaved)
      return res.status(400).json({
        success: false,
        message: "Course already saved",
      });

    const savedCourse = await Saved_Course.create({
      user_id,
      course_id: body.course_id,
    });

    return res.status(201).json({
      success: true,
      data: savedCourse,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
*/
// ================================ DELETE SAVED COURSE ==============================
// Supprimer un cours des favoris

export const deleteSavedCourse = async (req: AuthRequest, res: Response) => {
  try {
    let { course_id } = req.params;
    if (Array.isArray(course_id)) course_id = course_id[0];

    const user_id = req.user!.id;

    const savedCourse = await Saved_Course.findOne({
      where: {
        user_id,
        course_id,
      },
    });

    if (!savedCourse)
      return res
        .status(404)
        .json({ success: false, message: "Saved course not found" });

    await savedCourse.destroy();

    return res.status(200).json({
      success: true,
      message: "Saved course removed successfully",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
