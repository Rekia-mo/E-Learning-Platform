import { Request, Response } from "express";
import { Category } from "../models/index";

// ---------------------- FONCTION UTILITAIRE ----------------------
// Permet de s'assurer que l'id est bien une chaîne, même si Express le reçoit sous forme de tableau
const getIdFromParams = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

//------------ GET ALL CATEGORIES (GET)-------------------
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Récupérer toutes les catégories (TOUTES LES COLONNES)
    const categories = await Category.findAll(); // removed attributes to return all data

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err: any) {
    console.error("ERROR GET CATEGORIES:", err);
    return res.status(500).json({ err: err.message });
  }
};

//------------ POST CATEGORIE (POST)-------------------
export const createCategory = async (req: Request, res: Response) => {
  try {
    let { name } = req.body;

    // Validation simple du nom
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    name = name.trim();

    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Création de la catégorie
    const category = await Category.create({ name });

    return res.status(201).json({
      success: true,
      data: category, // retourne toutes les données
    });
  } catch (err: any) {
    console.error("ERROR CREATE CATEGORY:", err);
    return res.status(500).json({ err: err.message });
  }
};

//------------ PUT CATEGORIE (PUT)-------------------
export const updateCategory = async (req: Request, res: Response) => {
  try {
    // Sécuriser l'id
    const id = getIdFromParams(req.params.id);

    let { name } = req.body;

    // Validation du nom
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    name = name.trim();

    // Vérifier que la catégorie existe
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Mise à jour du nom
    await category.update({ name });

    return res.status(200).json({
      success: true,
      data: category, // retourne toutes les données
    });
  } catch (err: any) {
    console.error("ERROR UPDATE CATEGORY:", err);
    return res.status(500).json({ err: err.message });
  }
};

//------------ DELETE CATEGORIE (DELETE)-------------------
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    // Sécuriser l'id
    const id = getIdFromParams(req.params.id);

    // Vérifier que la catégorie existe
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Suppression de la catégorie
    await category.destroy();

    // Retourner seulement le message de succès
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err: any) {
    console.error("ERROR DELETE CATEGORY:", err);
    return res.status(500).json({ err: err.message });
  }
};
/*// category.controller.ts
import { Request, Response } from "express";
import { Category } from "../models/index";

// ---------------------- FONCTION UTILITAIRE ----------------------
// Permet de s'assurer que l'id est bien une chaîne, même si Express le reçoit sous forme de tableau
const getIdFromParams = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

//------------ GET ALL CATEGORIES (GET)-------------------
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Récupérer toutes les catégories en ne sélectionnant que le champ 'name'
    const categories = await Category.findAll({
      attributes: ["name"],
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("ERREUR GET CATEGORIES:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur interne",
    });
  }
};

//------------ POST CATEGORIE (POST)-------------------
export const createCategory = async (req: Request, res: Response) => {
  try {
    let { name } = req.body;

    // Validation simple du nom
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le nom de la catégorie est requis",
      });
    }
    name = name.trim();

    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "La catégorie existe déjà",
      });
    }

    // Création de la catégorie
    const category = await Category.create({ name });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error("ERREUR CREATE CATEGORY:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur interne",
    });
  }
};

//------------ PUT CATEGORIE (PUT)-------------------
export const updateCategory = async (req: Request, res: Response) => {
  try {
    // Sécuriser l'id
    const id = getIdFromParams(req.params.id);

    let { name } = req.body;

    // Validation du nom
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le nom de la catégorie est requis",
      });
    }
    name = name.trim();

    // Vérifier que la catégorie existe
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    // Mise à jour du nom
    await category.update({ name });

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error("ERREUR UPDATE CATEGORY:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur interne",
    });
  }
};

//------------ DELETE CATEGORIE (DELETE)-------------------
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    // Sécuriser l'id
    const id = getIdFromParams(req.params.id);

    // Vérifier que la catégorie existe
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    }

    // Suppression de la catégorie
    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Catégorie supprimée avec succès",
    });
  } catch (error: any) {
    console.error("ERREUR DELETE CATEGORY:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur interne",
    });
  }
};

   */
