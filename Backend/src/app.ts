import express from "express";
import cors from "cors";
import { send } from "node:process";
const app = express();


app.use(cors());
app.use(express.json());

app.get('/pfe',(req, res)=>{
  res.send('svit rwit');
})
app.listen(3000 ,()=>{
  console.log('listening to port 3000...');
});