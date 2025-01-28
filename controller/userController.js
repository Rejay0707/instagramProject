import {
  registerUser,
  checkUser,
  loginUser,
  getUser,
  followUser,
  unfollowUser,
  searchUsers,
} from "../service/userService.js";
import generateToken from "../utils/generateToken.js";
import { register, login } from "../middleware/authMiddleware.js";

//for register

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const { error } = register(req.body);

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      message: error.message,
    });
  }

  try {
    const userExists = await checkUser(email);
    console.log("User  exists:", userExists);

    if (userExists) {
      return res.status(400).json({
        message: "User  already exists",
      });
    }

    const user = await registerUser(username, email, password);
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed, please try again later.",
    });
  }
};

//for login user
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = login(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }

  try {
    const user = await loginUser(email, password);
    if (user) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid  email  or  password" });
  }
};

//get user by id

const getUserByID = async (req, res) => {
  const user = await getUser(req);
  res.status(200).json(user);
};

// Follow a user
const followUserController = async (req, res) => {
  const { userId, followId } = req.body;

  if (!userId || !followId) {
    return res.status(400).json({ message: "Both userId and followId are required" });
  }

  try {
    const user = await followUser(userId, followId);
    res.status(200).json(user);
  } catch (error) {
    if (error.message.startsWith('User with ID')) {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Cannot follow yourself") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};




// Unfollow a user
const unfollowUserController = async (req, res) => {
  const { userId, unfollowId } = req.body;

  try {
    const user = await unfollowUser(userId, unfollowId);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Cannot unfollow yourself") {
      res.status(400).json({ message: error.message });
    } else if (error.message === "Invalid user ID format") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};


const searchUsersController = async (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await searchUsers(query);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching users", error: error.message });
  }
};

export {
  createUser,
  getUserByID,
  authenticateUser,
  followUserController,
  unfollowUserController,
  searchUsersController,
};
