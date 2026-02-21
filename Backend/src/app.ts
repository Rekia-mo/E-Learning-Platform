import express from "express";
import cors from "cors";
import {sequelize} from "./config/db";
import userRoutes from "./routes/user.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);

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
