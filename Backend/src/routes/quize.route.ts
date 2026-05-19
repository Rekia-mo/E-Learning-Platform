import express from "express";
import { authorize } from "../middlewares/role.middelware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { generateQuiz, getQuizByCourse, updateQuestion } from "../controllers/quize.controller";

const router = express.Router();  

//generat quise ttcher 
router.post("/:id", authenticateToken, authorize(["Teacher"]), generateQuiz);

router.get("/:id", authenticateToken, getQuizByCourse);

router.put("/:questionId", authenticateToken, authorize(["Teacher"]), updateQuestion);
export default router;