const productService = require("../services/productService");

/**
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const { product_id, product_name } = req.body;
    const product = await productService.createProduct(product_id, product_name);
    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

/**
 * GET /api/products
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

/**
 * GET /api/products/:product_id
 */
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.product_id);
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

/**
 * PUT /api/products/:product_id
 */
const updateProduct = async (req, res) => {
  try {
    const { product_name } = req.body;
    const product = await productService.updateProduct(req.params.product_id, product_name);
    return res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

/**
 * DELETE /api/products/:product_id
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.product_id);
    return res.status(200).json({ message: "Product deleted", product });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
