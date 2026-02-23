import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authorize = (allowedRoles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      //verify role authorize(["student",...])
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Forbidden' });
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
};
