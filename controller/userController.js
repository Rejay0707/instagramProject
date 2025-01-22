import {
  registerUser,
  checkUser,
  loginUser,
  getUser,
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

export { createUser, getUserByID, authenticateUser };

