// course-comments.controller.ts
import { Request, Response } from "express";
import { CourseComment, Course, User } from "../models/index";
import { z } from "zod";

// Interface pour récupérer les infos de l'utilisateur depuis le token
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ================================ Schémas Zod ===============================

// Schéma pour créer un commentaire
const createCommentSchema = z.object({
  comment: z.string().min(1, "Le commentaire est requis"),
});

// Schéma pour mettre à jour un commentaire
const updateCommentSchema = z.object({
  comment: z.string().min(1).optional(),
});

// ================================ GET COMMENTS OF A COURSE =============================
// Récupérer tous les commentaires d'un cours spécifique

export const getCommentsByCourse = async (req: AuthRequest, res: Response) => {
  try {
    let { course_id } = req.params;
    if (Array.isArray(course_id)) course_id = course_id[0]; // sécurité TypeScript

    const comments = await CourseComment.findAll({
      where: { course_id },
      include: [
        { model: User, attributes: ["name"] },
        { model: Course, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ GET MY COMMENTS =============================
// Récupérer uniquement les commentaires de l'utilisateur connecté

export const getMyComments = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user!.id;

    const comments = await CourseComment.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ CREATE COMMENT (POST) ==============================
// Ajouter un commentaire à un cours spécifique

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    let { course_id } = req.params;
    if (Array.isArray(course_id)) course_id = course_id[0];

    const body = createCommentSchema.parse(req.body);
    const user_id = req.user!.id;

    const course = await Course.findByPk(course_id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const comment = await CourseComment.create({
      comment: body.comment,
      user_id,
      course_id,
    });

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ UPDATE COMMENT (PUT) ==============================
// Modifier un commentaire si l'utilisateur est propriétaire

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0];

    const body = updateCommentSchema.parse(req.body);
    const comment = await CourseComment.findByPk(id);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    const user_id = req.user!.id;
    if (comment.user_id !== user_id)
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this comment",
      });

    await comment.update({
      comment: body.comment ?? comment.comment,
    });

    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ DELETE COMMENT (DELETE) ==============================
// Supprimer un commentaire si l'utilisateur est propriétaire

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0];

    const comment = await CourseComment.findByPk(id);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    const user_id = req.user!.id;
    if (comment.user_id !== user_id)
      return res.status(403).json({
        success: false,
        message: "User is not authorized to delete this comment",
      });

    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ DELETE COMMENT BY ADMIN (DELETE) ==============================
// Supprimer un commentaire si l'utilisateur est Admin

export const deleteCommentByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0];

    const comment = await CourseComment.findByPk(id);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully by admin",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
