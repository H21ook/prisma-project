import { Router } from "express";
import { AuthService } from "../services/auth-service";
const authRouter = Router();

const authService = new AuthService();
authRouter.post("/register", async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});
export default authRouter;
