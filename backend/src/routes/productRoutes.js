const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", isAuthenticated, createProduct);
router.get("/", isAuthenticated, getAllProducts);
router.get("/:product_id", isAuthenticated, getProductById);
router.put("/:product_id", isAuthenticated, updateProduct);
router.delete("/:product_id", isAuthenticated, deleteProduct);

module.exports = router;
