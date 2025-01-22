import User from "../model/userSchema.js";

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

export { registerUser, checkUser, loginUser, getUser };
