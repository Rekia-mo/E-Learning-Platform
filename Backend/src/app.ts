import express from "express";
import {sequelize} from "./config/db";
import { setupRoutes } from "./setup/routes";

const app = express();

setupRoutes(app);

// Démarrage du serveur après connexion à la base de données
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB ...");

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000 ...");
    });
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

startServer();
