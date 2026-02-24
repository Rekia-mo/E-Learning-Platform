// ErrorHandling.ts
import { Request, Response, NextFunction } from "express";

// definition d'une interface pour les erreurs personnalisées
interface CustomError extends Error {
  statusCode?: number;
}

// Error-handling middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // si le statusCode n'est pas défini dans l'erreur, on utilise 500 par défaut
  const statusCode = err.statusCode || 500;

  // Response JSON avec le message d'erreur et éventuellement la stack trace en développement
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    // stack tarce uniquement en développement pour éviter de donner des informations sensibles en production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
