import express from "express";
import cors from "cors";
import userRoutes from "../routes/user.route";
import authRoutes from "../routes/auth.route";
import { errorHandler } from "../middlewares/ErrorHandling";

export function setupRoutes(app: express.Application){
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use(errorHandler);
}
