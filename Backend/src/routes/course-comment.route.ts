// course-comments.routes.ts
import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  getCommentsByCourse,
  getMyComments,
  createComment,
  updateComment,
  deleteComment,
  deleteCommentByAdmin,
} from "../controllers/course-comment.controller";

const router = express.Router();

// ================================ ROUTES ===============================

//-------------------------------GET-------------------------------

// 🔹 Récupérer tous les commentaires d'un cours spécifique
router.get("/course/:course_id", getCommentsByCourse);

// 🔹 Récupérer mes commentaires
router.get("/me", authenticateToken, getMyComments);

//-------------------------------POST------------------------------

// 🔹 Créer un commentaire pour un cours
router.post("/course/:course_id", authenticateToken, createComment);

//-------------------------------PUT------------------------------

// 🔹 Mettre à jour mon commentaire
router.put("/:id", authenticateToken, authorize(["Student", "Teacher"]), updateComment);

//-------------------------------DELETE------------------------------

// 🔹 Supprimer mon commentaire
router.delete("/:id", authenticateToken, authorize(["Student", "Teacher"]), deleteComment);

//-------------------------------DELETE (ADMIN)------------------------------

// 🔹 Supprimer un commentaire en tant qu'admin
router.delete("/admin/:id", authenticateToken, authorize(["admin"]), deleteCommentByAdmin);

export default router;