import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const port = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/user', userRoutes);

// Export the app for testing
export default app;

// Start the server only if this file is run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log("Server is running on port " + port);
  });
}