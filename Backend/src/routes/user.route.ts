import express from "express";
import { createUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../models/User.Model";

const router = express.Router();

router.post("/register",validate(createUserSchema),createUser);

export default router;