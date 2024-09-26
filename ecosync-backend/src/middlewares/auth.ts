import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import UserSession from "../models/usersession.js";
import ErrorHandler from "../utils/utility-class.js";

export const systemAdminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new ErrorHandler("Token not found", 401));
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userSession = await UserSession.findOne({
      userId: decodedToken.userId,
      token,
    });

    if (!userSession) {
      return next(new ErrorHandler("Invalid token userSession", 401));
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.role !== "system_admin") {
      return next(new ErrorHandler("Access denied", 403));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};

export const stsManagerOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new ErrorHandler("Token not found", 401));
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userSession = await UserSession.findOne({
      userId: decodedToken.userId,
      token,
    });

    if (!userSession) {
      return next(new ErrorHandler("Invalid token userSession", 401));
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.role !== "sts_manager") {
      return next(new ErrorHandler("Access denied", 403));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};

export const landfillManagerOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new ErrorHandler("Token not found", 401));
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userSession = await UserSession.findOne({
      userId: decodedToken.userId,
      token,
    });

    if (!userSession) {
      return next(new ErrorHandler("Invalid token userSession", 401));
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.role !== "landfill_manager") {
      return next(new ErrorHandler("Access denied", 403));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};
