import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();
const port = process.env.PORT || 8000;
const app = express();

app.listen(port, () => {
  console.log("server is running on port " + port);
});

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended : false}))

app.use('/api/user', userRoutes)