import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { getRecommendations } from "../controllers/recommendation.controller";

const router = express.Router();

// GET /api/recommendations/:userId
router.get("/:userId", authenticateToken, getRecommendations);

export default router;