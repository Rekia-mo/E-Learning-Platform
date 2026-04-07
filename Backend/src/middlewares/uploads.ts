import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {

    if (file.fieldname === "cv_URL") {
      cb(null, "uploads/cvs");
    }

    else if (file.fieldname === "image_url") {
      cb(null, "uploads/thumbnails");
    }

    else if (file.fieldname === "document") {
      cb(null, "uploads/documents");
    }

    else if (file.fieldname === "vedio_url") {
      cb(null, "uploads/videos");
    }

    else {
      cb(new Error("Invalid file field"), "");
    }

  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // 1GB 
});
