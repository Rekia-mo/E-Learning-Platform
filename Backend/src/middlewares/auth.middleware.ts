// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "secretkey";

// Type local pour Request avec la propriété user
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format "Bearer <token>"

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied: no token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.user = decoded; // Ajoute les infos de l'utilisateur décodé à la requête
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
