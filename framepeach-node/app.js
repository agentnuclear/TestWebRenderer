import express from "express"
import cors from 'cors'

import authRouter from "./routes/authentication/auth.js";

import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:' * ',credentials:true}));
    
app.use("/api/auth", authRouter);



    
  app.listen(port, () => console.log('Server is working on Port:'+port));
  