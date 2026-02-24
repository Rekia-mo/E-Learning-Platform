import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod"; //Zod = bibliothèque pour définir des schémas et valider les données

export const validate = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err
        .issues.map(issue => ({
          field: issue.path[0],
          message: issue.message
        }))
      });
    }
  }
};