import request from "supertest";
import app from "../server.js";
import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

jest.setTimeout(30000);

describe("User Registration and Login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({}); // Clearing the User collection
  });

  afterAll(async () => {
    await User.deleteMany({}); // Cleaning up the database
    await mongoose.connection.close(); // Closing the database connection
  });

  describe("POST /api/user/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/user/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("username", "testuser");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });

    it("should not register a user with an existing email", async () => {
      const res = await request(app)
        .post("/api/user/register")
        .send({
          username: "testuser2",
          email: "test@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "User  already exists"); // Matching the actual error message
    });

    it("should not register a user with missing fields", async () => {
      const res = await request(app)
        .post("/api/user/register")
        .send({
          // Missing username, email, and password
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should not register a user with an invalid email format", async () => {
      const res = await request(app)
        .post("/api/user/register")
        .send({
          username: "testuser",
          email: "invalid-email", // Invalid email format
          password: "password123",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /api/user/login", () => {
    beforeAll(async () => {
      // Creating a user for login tests if it doesn't already exist
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userExists = await User.findOne({ email: "test@example.com" });
      if (!userExists) {
        await User.create({
          username: "testuser",
          email: "test@example.com",
          password: hashedPassword,
        });
      }
    });

    it("should login an existing user", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("username", "testuser");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(401); // Matching the actual status code
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should not login with missing fields", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          // Missing email and password
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should not login with an invalid email format", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          email: "invalid-email", // Invalid email format
          password: "password123",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message");
    });
  });
}); 

