import express from "express";
import cors from "cors";
<<<<<<< HEAD
import {sequelize} from "./config/db";
import userRoutes from "./routes/user.route";
=======
import authRoutes from "./routes/auth.route";
import { sequelize } from "./config/db";
>>>>>>> 604b8b5354eeda1accdee6b1cf0de70262a470fb

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

<<<<<<< HEAD
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
=======
sequelize
  .authenticate()
  .then(() => console.log("connected to db ..."))
  .catch((err) => console.log("DB ERR: ", err));

app.listen(3000, () => {
  console.log("listening to port 3000...");
});
>>>>>>> 604b8b5354eeda1accdee6b1cf0de70262a470fb
