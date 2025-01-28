import express from "express";
import {
  createUser,
  getUserByID,
  authenticateUser,
  followUserController,
  unfollowUserController,
  searchUsersController
} from "../controller/userController.js";

const router = express.Router();

router.get("/search", searchUsersController)
router.post("/register", createUser);
router.get("/:id", getUserByID);
router.post("/login", authenticateUser);
router.post("/follow", followUserController);
router.post("/unfollow", unfollowUserController);


export default router;
