import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = express.Router();

// POST /api/categories -> créer une catégorie
router.post("/", authenticateToken, authorize(["Admin"]), createCategory);

// GET /api/categories -> afficher toutes les catégories
router.get("/", authenticateToken, getCategories);

// PUT /api/categories/:id -> mettre à jour une catégorie
router.put("/:id", authenticateToken, authorize(["Admin"]), updateCategory);

// DELETE /api/categories/:id -> supprimer une catégorie
router.delete("/:id", authenticateToken, authorize(["Admin"]), deleteCategory);

export default router;
