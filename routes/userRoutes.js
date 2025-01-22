import express from "express";
import {
  createUser,
  getUserByID,
  authenticateUser,
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/:id", getUserByID);
router.post("/login", authenticateUser)

export default router;
