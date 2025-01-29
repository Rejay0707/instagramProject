import mongoose from 'mongoose';
import User from '../model/userSchema';
import { followUser } from '../service/userService';

jest.setTimeout(40000); // Set Jest timeout to 40 seconds

describe('Follow User', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect('mongodb+srv://rejaysobi:rejay123@cluster0.xw9gg.mongodb.net/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 20000, // 20 seconds
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  });

  afterEach(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB connection not established for cleanup');
        return;
      }
      await User.deleteMany({});
    } catch (error) {
      console.error('Error during afterEach cleanup:', error);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting MongoDB:', error);
    }
  });

  it('should allow a user to follow another user', async () => {
    // Create two users
    const user1 = await User.create({ username: 'user1', email: 'user1@example.com', password: 'hashedPassword' });
    const user2 = await User.create({ username: 'user2', email: 'user2@example.com', password: 'hashedPassword' });

    // Debugging log to check user IDs
    console.log("User1 ID:", user1._id);
    console.log("User2 ID:", user2._id);

    // Debugging: Check if users exist in the database
    const userInDb1 = await User.findById(user1._id);
    const userInDb2 = await User.findById(user2._id);
    console.log("User1 from DB:", userInDb1);
    console.log("User2 from DB:", userInDb2);

    // Call the followUser function with the correct arguments
    const result = await followUser(user1._id, user2._id);

    // Find the user1 after following to check if the follow action was successful
    const updatedUser1 = await User.findById(user1._id);

    // Check if user1 is following user2
    console.log("Updated User1 following:", updatedUser1.following);
    expect(updatedUser1.following).toContainEqual(user2._id);
  });
});