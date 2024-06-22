import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/dataconn.mjs";
import userRouter from "./routes/userRoutes.mjs";
import { logger } from "./middleware/logger.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import cors from "cors";
import corsOptions from "./config/corsOptions.mjs";

const server = express();
const PORT = process.env.PORT || 2777;

dotenv.config();
connectDB();

server.use(express.json());
server.use(logger);
server.use(cors(corsOptions));

server.use("/users", userRouter);

server.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connecting to database");
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
