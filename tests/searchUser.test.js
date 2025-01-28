import request from "supertest";
import app from "../server.js"; // Adjust the path as necessary
import User from "../model/userSchema.js"; // Adjust the path as necessary
import mongoose from "mongoose";

jest.setTimeout(30000); // Increase timeout to 30 seconds

describe("Search Users", () => {
  let user1, user2;

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await User.deleteMany({}); // Clear the User collection

      // Create two users for testing
      user1 = await User.create({
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
      });

      user2 = await User.create({
        username: "jane_doe",
        email: "jane@example.com",
        password: "password123",
      });
    } catch (error) {
      console.error("Failed to set up Search Users tests", error);
    }
  });

  afterAll(async () => {
    await User.deleteMany({}); // Clean up the database
    await mongoose.connection.close(); // Close the database connection
  });

  it("should return users matching the search query in username", async () => {
    const query = "john";
    const res = await request(app).get(`/api/user/search?query=${query}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].username).toContain(query);
  });

  it("should return users matching the search query in email", async () => {
    const query = "jane@example.com";
    const res = await request(app).get(`/api/user/search?query=${query}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].email).toContain(query);
  });

  it("should return an empty array if no users match the search query", async () => {
    const query = "nonexistent";
    const res = await request(app).get(`/api/user/search?query=${query}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return a 400 error if the search query is missing", async () => {
    const res = await request(app).get("/api/user/search");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Search query is required");
  });

  it("should handle errors and return a 500 status code", async () => {
    // Mocking a failure in the User.find method
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const query = "john";
    const res = await request(app).get(`/api/user/search?query=${query}`);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message", "Error searching users");
    expect(res.body).toHaveProperty("error", "Database error");

    // Restore the original implementation
    jest.restoreAllMocks();
  });
});