import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import UserSession from "../models/usersession.js";
import ResetCode from "../models/reset-code.js";
import nodemailer from "nodemailer";

const sendResetCodeByEmail = async (email: string, code: string) => {
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
    const mailOptions = {
      from: "support.ecosync@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset code email:", error);
    throw new Error("Failed to send reset code email");
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!
    );

    const userData = {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoUrl,
      token: token,
    };

    const userSession = new UserSession({
      userId: user._id,
      token,
    });

    await userSession.save();

    res.status(200).json({ user: userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token is missing." });
    }

    const userSession = await UserSession.findOne({ token });

    if (!userSession) {
      return res.status(404).json({ message: "Invalid token." });
    }

    await userSession.deleteOne();

    res.status(200).json({ success: true, message: "Logout successful." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const initiatePasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email is not registered." });
    }

    const resetCode = Math.floor(10000 + Math.random() * 90000).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const resetCodeEntry = new ResetCode({
      username: user.username,
      email: user.email,
      code: resetCode,
      expirationTime,
    });
    await resetCodeEntry.save();

    await sendResetCodeByEmail(user.email, resetCode);
    res.status(200).json({
      success: true,
      message:
        "Password reset initiated. Check your email for further instructions.",
    });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const confirmPasswordReset = async (req: Request, res: Response) => {
  try {
    const { code, newPassword } = req.body;

    if (!code || !newPassword) {
      return res.status(400).json({ message: "Code and new password are required." });
    }

    const resetCodeEntry = await ResetCode.findOne({ code });
    if (!resetCodeEntry) {
      return res
        .status(404)
        .json({ message: "Reset code not found or expired." });
    }

    const currentTime = new Date();
    if (currentTime > resetCodeEntry.expirationTime) {
      return res.status(400).json({ message: "Reset code has expired." });
    }

    const user = await User.findOne({ email: resetCodeEntry.email });
    if (!user) {
      return res.status(404).json({ message: "Email is not registered." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await ResetCode.deleteOne({ code });

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error confirming password reset:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "User id, old password and new password are required." });
    }
  
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token is missing." });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const tokenUserId = decodedToken.userId;
    if (tokenUserId !== userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid user." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid old password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
