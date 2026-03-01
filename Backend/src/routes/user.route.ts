import express from "express";
import { createUser, getUsers, deleteUser, updateUserRole, updateUser, getUserProfile } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../models/User.Model";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middelware";


const router = express.Router();
//register
router.post("/register", validate(createUserSchema), createUser);
//get all users (admin only)
router.get("/", authenticateToken, authorize(["Admin"]), getUsers);
//delete user by id (admin only)
router.delete("/:id", authenticateToken ,authorize(["Admin"]) , deleteUser);
//update user role by id (admin only)
router.put("/:id/role", authenticateToken,authorize(["Admin"]), updateUserRole);

//update user (by user)
router.put("/me", authenticateToken, updateUser);
//get user profile
router.get("/me", authenticateToken, getUserProfile);

export default router;