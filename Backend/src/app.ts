import express from "express";
import cors from "cors"; // Gérer les requêtes cross-origin
import { sequelize } from "./config/db";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { errorHandler } from "./middlewares/ErrorHandling";

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Middleware de gestion des erreurs (toujours après les routes)
app.use(errorHandler);

// Démarrage du serveur après connexion à la base de données
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB ...");

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

startServer();
