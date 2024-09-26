import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Role from "../models/role.js";

const sendEmail = async (email: string, username: string, password: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to EcoSync</title>
      <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5; /* Background color */
        background-image: url('background-image-url.jpg'); /* Add your background image URL here */
        background-size: cover;
        background-position: center;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #008080;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 10px;
      }
      strong {
        font-weight: bold;
      }
      hr {
        border: 1px solid #ddd;
        margin: 20px 0;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to EcoSync!</h1>
        <p>Your account details:</p>
        <ul>
          <li><strong>Username:</strong> ${username}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please login and change your username and password.</p>
        <p>Thank you for joining EcoSync!</p>
      </div>
    </body>
    </html>    
    `;

    const mailOptions = {
      from: "support.ecosync@gmail.com",
      to: email,
      subject: "Your account details",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, { password: 0 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUnassignedUsers = async (req: Request, res: Response) => {
  try {
    const unassignedUsers = await User.find({ role: "unassigned" });

    res.status(200).json({ users: unassignedUsers });
  } catch (error) {
    console.error("Error retrieving unassigned users:", error);
    res.status(500).json({ message: "Failed to retrieve unassigned users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, role } = req.body;
  try {
    if (!email || !role) {
      return res.status(400).json({ message: "Email and Role are required." });
    }

    const randomUsername = randomBytes(3).toString("hex");
    const randomPassword = randomBytes(4).toString("hex");

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
      username: randomUsername,
      password: hashedPassword,
      email,
      role,
      name: "",
      phoneNumber: "",
      photoUrl: "",
    });

    await newUser.save();

    await sendEmail(email, randomUsername, randomPassword);

    res.status(201).json({
      success: true,
      message: `User created successfully, Credentials sent on this ${email}.`,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No token provided." });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = req.params;

    if (
      decodedToken.userId !== userId &&
      decodedToken.role !== "system_admin"
    ) {
      return res.status(403).json({
        message: "Access Denied: You are not authorized to view this user.",
      });
    }

    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No token provided" });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!userId) {
      return res.status(400).json({ message: "User id is required." });
    }

    if (
      decodedToken.userId !== userId &&
      decodedToken.role !== "system_admin"
    ) {
      return res.status(403).json({
        message: "Access Denied: You are not authorized to update this user",
      });
    }
    const { username, name, phoneNumber, photoUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Username already exists" });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (photoUrl) user.photoUrl = photoUrl;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find({});

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error listing roles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserRoles = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { role } = req.body;
    if (!role) {
      return res
        .status(400)
        .json({ message: "Roles must be provided as an array" });
    }

    user.role = role;

    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
