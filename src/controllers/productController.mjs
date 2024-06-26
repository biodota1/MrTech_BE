import Product from "../model/Product.mjs";

export const getAllProducts = async (req, res) => {
  const products = await Product.find().lean();
  if (!products?.length) {
    return res.status(400).json({ message: "No products found." });
  }
  res.json(products);
};

export const getAllProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    let products;
    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find({});
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ isError: true, message: error.message });
  }
};

export const addNewProduct = async (req, res) => {
  const { name, category, price, description } = req.body;

  //Confirm data
  if (!name || !category || !price) {
    return res.status(400).json({ message: "All field are required" });
  }

  //Check for duplicate
  const duplicate = await Product.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Product" });
  }

  //Add New Product
  const productObject = { name, category, price, description };

  const product = await Product.create(productObject);

  if (product) {
    res.status(201).json({ message: `${name} is Added.` });
  } else {
    res.status(400).json({ message: "Invalid product data received" });
  }
};
