import User from "../model/userSchema.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//for registration

const registerUser = async (username, email, password) => {
  const user = await User.create({
    username,
    email,
    password,
  });
  return user;
};
console.log(registerUser);

//to check user

const checkUser = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    return user;
  }
};

//for login

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user) {
      return user;
    } else {
      throw new Error("invalid email or password");
    }
  }
};

//get user by id

const getUser = async (req) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return user;
  } else {
    throw new Error("User not found");
  }
};



const followUser = async (userId, followId) => {
  try {
    console.log("Attempting to follow user:", { userId, followId });

    // Validate the IDs
    if (!userId || !followId) {
      throw new Error("Both userId and followId are required");
    }

    // Check if user is trying to follow themselves
    if (userId.equals(followId)) {
      throw new Error("Cannot follow yourself");
    }

    // Finding the user and the user to follow
    console.log("Finding user with ID:", userId);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    console.log("Finding user to follow with ID:", followId);
    const userToFollow = await User.findById(followId);
    if (!userToFollow) {
      throw new Error(`User with ID ${followId} not found`);
    }

    // Ensure no duplicates in `following` and `followers`
    if (!user.following.includes(followId.toString())) {
      console.log(`Adding user ${userId} to following list of ${followId}`);
      user.following.push(followId);
    }

    if (!userToFollow.followers.includes(userId.toString())) {
      console.log(`Adding user ${followId} to followers list of ${userId}`);
      userToFollow.followers.push(userId);
    }

    // Save both users
    await Promise.all([user.save(), userToFollow.save()]);

    console.log("User updated:", user);
    console.log("UserToFollow updated:", userToFollow);

    return user;
  } catch (error) {
    console.error("Error in followUser function:", error);
    throw error;
  }
};




//Unfollow a user

const unfollowUser = async (userId, unfollowId) => {
  // Validate the ObjectId format
  if (!isValidObjectId(userId) || !isValidObjectId(unfollowId)) {
    throw new Error("Invalid user ID format");
  }

  // Check if the user is trying to unfollow themselves
  if (userId === unfollowId) {
    throw new Error("Cannot unfollow yourself");
  }

  const user = await User.findById(userId);
  const userToUnfollow = await User.findById(unfollowId);

  if (!user || !userToUnfollow) {
    throw new Error("User not found");
  }

  // Remove unfollowId from the user's following list
  user.following = user.following.filter(
    (id) => id.toString() !== unfollowId.toString()
  );

  // Remove userId from the userToUnfollow's followers list
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== userId.toString()
  );

  await user.save();
  await userToUnfollow.save();

  return user;
};

// Search for users by username or email
const searchUsers = async (query) => {
  const users = await User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  });
  return users;
};

export {
  registerUser,
  checkUser,
  loginUser,
  getUser,
  followUser,
  unfollowUser,
  searchUsers,
};
