import express, { Router } from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  getCommentsByPost,
  getMyComments,
  createComment,
  updateComment,
  deleteComment,
  deleteCommentByAdmin,
} from "../controllers/post-comment-controller";

const router = Router();

// ================= GET =================

// tous les commentaires
router.get("/post/:post_id", authenticateToken, getCommentsByPost);

// commentaires du user connecté
router.get("/me", authenticateToken, getMyComments);

// ================= POST =================

// ajouter commentaire
router.post("/:post_id", authenticateToken, createComment);

// ================= PUT =================

// modifier commentaire
router.put(
  "/:id",
  authenticateToken,
  authorize(["Student", "Teacher"]),
  updateComment,
);

// ================= DELETE =================

// supprimer commentaire
router.delete(
  "/:id",
  authenticateToken,
  authorize(["Student", "Teacher"]),
  deleteComment,
);

// supprimer commentaire (Admin)
router.delete(
  "/:id/admin",
  authenticateToken,
  authorize(["Admin"]),
  deleteCommentByAdmin,
);

export default router;
