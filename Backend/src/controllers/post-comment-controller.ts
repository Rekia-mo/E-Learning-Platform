// post-comments.controller.ts
import { Request, Response } from "express";
import { PostComment, Post, User } from "../models/index";
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

// ================================ GET COMMENTS OF A POST =============================
// Récupérer tous les commentaires d'un post spécifique

export const getCommentsByPost = async (req: AuthRequest, res: Response) => {
  try {
    // Récupérer l'ID du post depuis l'URL
    let { post_id } = req.params;
    if (Array.isArray(post_id)) post_id = post_id[0]; // sécurité TypeScript

    // Chercher tous les commentaires liés à ce post
    const comments = await PostComment.findAll({
      where: { post_id },
      include: [
        { model: User, attributes: ["name"] }, // info de l'auteur
        { model: Post, attributes: ["title"] }, // info du post
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: comments.length, // nombre total de commentaires
      data: comments, // tous les commentaires du post
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
/*
// ================================ GET ALL COMMENTS =============================
// Récupérer tous les commentaires

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await PostComment.findAll({
      include: [
        { model: User, attributes: ["name"] },
        { model: Post, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: comments.length, // nombre total de commentaires
      data: comments,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
*/
// ================================ GET MY COMMENTS =============================
// Récupérer uniquement les commentaires de l'utilisateur connecté

export const getMyComments = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user!.id;

    const comments = await PostComment.findAll({
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
// Ajouter un commentaire à un post spécifique

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    // récupération de l'id du post depuis l'URL
    let { post_id } = req.params;
    if (Array.isArray(post_id)) post_id = post_id[0]; // sécurité TypeScript

    // validation du body avec Zod
    const body = createCommentSchema.parse(req.body);

    // récupération de l'utilisateur connecté
    const user_id = req.user!.id;

    // vérifier que le post existe
    const post = await Post.findByPk(post_id);

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // création du commentaire
    const comment = await PostComment.create({
      comment: body.comment,
      user_id,
      post_id,
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
    if (Array.isArray(id)) id = id[0]; // sécurité TypeScript

    // validation du body
    const body = updateCommentSchema.parse(req.body);

    const comment = await PostComment.findByPk(id);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    // vérifier que l'utilisateur est le propriétaire
    const user_id = req.user!.id;

    if (comment.user_id !== user_id)
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this comment",
      });

    // mise à jour
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

    const comment = await PostComment.findByPk(id);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    // vérification de propriété
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
// Supprimer un commentaire si l'utilisateur est Admin (la vérification est faite dans le middleware)

export const deleteCommentByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    // récupérer l'id du commentaire depuis les paramètres de l'URL
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0]; // sécurité TypeScript

    // chercher le commentaire dans la base de données
    const comment = await PostComment.findByPk(id);

    // si le commentaire n'existe pas
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    // suppression du commentaire
    await comment.destroy();

    // réponse envoyée au client
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully by admin",
    });
  } catch (err: any) {
    // affichage de l'erreur dans le terminal
    console.log(err);

    // réponse en cas d'erreur serveur
    return res.status(500).json({ err: err.message });
  }
};
