import express from "express";
import {
  getAllProducts,
  getAllProductsByCategory,
} from "../controllers/productController.mjs";

const publicProductRouter = express.Router();

publicProductRouter.route("/products").get(getAllProducts);

publicProductRouter.route("/").get(getAllProductsByCategory);

export default publicProductRouter;
