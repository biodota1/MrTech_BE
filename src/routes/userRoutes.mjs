import express from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.mjs";
import verifyJWT from "../middleware/verifyJWT.mjs";

const userRouter = express.Router();

userRouter.use(verifyJWT);

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .put(updateUser)
  .delete(deleteUser);

export default userRouter;
