// auth.route.ts
import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// Route login seulement
router.post("/login", login);

export default router;
