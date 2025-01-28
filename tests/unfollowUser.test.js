import { unfollowUser } from "../service/userService.js";
import User from "../model/userSchema.js";
import mongoose from "mongoose";

// Mock the User model
jest.mock("../model/userSchema");

describe("Unfollow User", () => {
  let user1, user2;

  beforeAll(() => {
    // Mock the mongoose User.findById method
    user1 = {
      _id: new mongoose.Types.ObjectId(),  // Use 'new' to create ObjectId
      following: [],
      followers: [],
      save: jest.fn().mockResolvedValue(true),
    };
    user2 = {
      _id: new mongoose.Types.ObjectId(),  // Use 'new' to create ObjectId
      following: [],
      followers: [],
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValueOnce(user1).mockResolvedValueOnce(user2);
  });

  beforeEach(() => {
    // Reset the mock data before each test
    user1.following = [];
    user2.followers = [];
  });

  it("should allow user1 to unfollow user2", async () => {
    // Act
    await unfollowUser(user1._id, user2._id);

    // Assert that user1's following array is empty
    expect(user1.following).not.toContain(user2._id.toString());
    expect(user2.followers).not.toContain(user1._id.toString());

    // Ensure both user.save methods were called
    expect(user1.save).toHaveBeenCalled();
    expect(user2.save).toHaveBeenCalled();
  });

  it("should not allow a user to unfollow themselves", async () => {
    try {
      await unfollowUser(user1._id, user1._id);
    } catch (error) {
      expect(error.message).toBe("Cannot unfollow yourself");
    }
  });

  it("should not allow unfollowing a non-existent user", async () => {
    // Mock user2 to be null (non-existent user)
    User.findById.mockResolvedValueOnce(null).mockResolvedValueOnce(user2);

    try {
      await unfollowUser(user1._id, user2._id);
    } catch (error) {
      expect(error.message).toBe("User not found");
    }
  });

  it("should return an error if the user ID format is invalid", async () => {
    try {
      await unfollowUser("invalidUserId", user2._id);
    } catch (error) {
      expect(error.message).toBe("Invalid user ID format");
    }
  });
});

