import { Request, Response, NextFunction } from "express";
import { Teacher } from "../models/index";

export const checkPsychologist = async (req: Request, res: Response, next: NextFunction) => {
  const isSpecialized = req.body.isSpecialized === true || req.body.isSpecialized === "true";

  // If not a specialized course, no restriction needed
  if (!isSpecialized) return next();

  try {
    const user = (req as any).user;
    const teacher = await Teacher.findOne({ where: { user_id: user.id } });


    if (!teacher || !teacher.isPsychologist) {
      return res.status(403).json({ message: "Only psychologist teachers can create specialized courses." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authorization check." });
  }
};