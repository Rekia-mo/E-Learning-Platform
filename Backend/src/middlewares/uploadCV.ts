import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, "uploads/cvs");
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const ext = path.extname(file.originalname);
    cb(null, `cv-${Date.now()}${ext}`);
  },
});

export const uploadCV = multer({  
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});