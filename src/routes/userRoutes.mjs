import express from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .put(updateUser)
  .delete(deleteUser);

export default userRouter;
