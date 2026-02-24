import express from "express";
import {sequelize} from "./config/db";
import { setupRoutes } from "./setup/routes";

const app = express();

setupRoutes(app);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("connected to db ...");

    app.listen(3000, () => {
      console.log("listening on port 3000...");
    });

  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}

startServer();