
import Joi from "joi";

// Register User(validation)

const register = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

// Login User(validation)
const login = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export { register, login };
