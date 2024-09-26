import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No token provided" });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decodedToken.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No token provided" });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const { username, name, phoneNumber, photoUrl } = req.body;

    if (username) user.username = username;
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (photoUrl) user.photoUrl = photoUrl;

    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
