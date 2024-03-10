import prisma from "../config/prisma";
import { LoginInput, RegisterInput } from "../types/auth";
import { comparePassword, hashPassword } from "../utils";
import { TokenService } from "./token-service";

export class AuthService {
  tokenService: TokenService;
  constructor() {
    this.tokenService = new TokenService();
  }

  async login(data: LoginInput) {
    const { username, password } = data;
    let foundUser = await prisma.user.findUnique({
      where: {
        email: username,
      },
    });

    if (!foundUser) {
      foundUser = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!foundUser) {
        return {
          code: 500,
          message: "Invalid username or password",
        };
      }
    }
    const isValidPassword = await comparePassword(foundUser.password, password);

    if (!isValidPassword) {
      return {
        code: 500,
        message: "Invalid username or password2",
      };
    }

    const { password: uPassword, ...other } = foundUser;

    const { token } = await this.tokenService.getAccessToken(other);

    return {
      code: 200,
      data: {
        token,
      },
    };
  }

  async register(data: RegisterInput) {
    const { email, username, password } = data;
    let foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (foundUser) {
      return {
        code: 500,
        message: "Email already registered.",
      };
    }

    foundUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (foundUser) {
      return {
        code: 500,
        message: "Email already registered.",
      };
    }

    const hashedPassword = await hashPassword(password);
    try {
      const result = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      return {
        code: 200,
        data: {
          id: result.id,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
