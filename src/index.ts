import express, { urlencoded, json } from "express";
import helmet from "helmet";
import { config } from "dotenv";

config();

// sub routes
import authRouter from "./routes/auth.routes";
import prisma from "./config/prisma";

const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());

// security
app.use(helmet());

app.get("/", function (req, res) {
  res.send("Application running...");
});

app.use("/auth", authRouter);

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/post", function (req, res) {
  res.status(200).json(req.body);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Application running on ${PORT} port`);
});
