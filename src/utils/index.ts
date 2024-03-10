import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  userPassword: string,
  password: string
) => {
  return await bcrypt.compare(password, userPassword);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("My error", { error: err });
};
