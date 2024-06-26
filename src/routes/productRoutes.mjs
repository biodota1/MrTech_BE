import express from "express";
import {
  addNewProduct,
  getAllProducts,
} from "../controllers/productController.mjs";
import verifyJWT from "../middleware/verifyJWT.mjs";

const productRouter = express.Router();

productRouter.use(verifyJWT);

productRouter.route("/").get(getAllProducts).post(addNewProduct);

export default productRouter;
