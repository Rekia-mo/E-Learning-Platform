import express from "express";
import cors from "cors";
import {sequelize} from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(()=> console.log("connected to db ..."))
  .catch((err)=>console.log("DB ERR: ", err));


app.listen(3000 ,()=>{
  console.log('listening to port 3000...');
});