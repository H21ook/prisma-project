import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export class TokenService {
  constructor() {}

  public static async verifyAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const bearerToken = req.headers?.authorization;
    if (!bearerToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = bearerToken.substring(7);
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const tokenData = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log("verify ", tokenData);
      req.user = tokenData as User;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  async getAccessToken(data: {
    id: number;
    email: string;
    username: string;
  }): Promise<{
    token: string;
    tokenData: JwtPayload | string;
  }> {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      audience: data.id.toString(),
      issuer: "bitsup.mn",
    });
    const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { token, tokenData };
  }
}
