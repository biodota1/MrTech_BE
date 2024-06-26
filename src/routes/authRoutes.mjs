import express from "express";
import loginLimiter from "../middleware/loginLimiter.mjs";
import {
  login,
  refresh,
  logout,
  register,
} from "../controllers/authController.mjs";

const authRouter = express.Router();

authRouter.route("/").post(login);

authRouter.route("/register").post(register);

authRouter.route("/refresh").get(refresh);

authRouter.route("/logout").post(logout);

export default authRouter;
