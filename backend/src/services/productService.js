const { pool } = require("../config/db");

/**
 * Create a new product.
 * Throws if product_id already exists or fields are missing.
 */
const createProduct = async (product_id, product_name) => {
  if (!product_id || !product_name) {
    throw { status: 400, message: "product_id and product_name are required" };
  }

  // Check for duplicate product_id
  const existing = await pool.query(
    "SELECT id FROM products WHERE product_id = $1",
    [product_id]
  );

  if (existing.rows.length > 0) {
    throw { status: 409, message: `Product with id '${product_id}' already exists` };
  }

  const result = await pool.query(
    "INSERT INTO products (product_id, product_name) VALUES ($1, $2) RETURNING *",
    [product_id, product_name]
  );

  return result.rows[0];
};

/**
 * Get all products.
 */
const getAllProducts = async () => {
  const result = await pool.query(
    "SELECT product_id, product_name FROM products ORDER BY id ASC"
  );
  return result.rows;
};

/**
 * Get a single product by product_id.
 * Throws if not found.
 */
const getProductById = async (product_id) => {
  const result = await pool.query(
    "SELECT product_id, product_name FROM products WHERE product_id = $1",
    [product_id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: `Product '${product_id}' not found` };
  }

  return result.rows[0];
};

/**
 * Update a product's name by product_id.
 * Throws if not found or fields are missing.
 */
const updateProduct = async (product_id, product_name) => {
  if (!product_name) {
    throw { status: 400, message: "product_name is required" };
  }

  const result = await pool.query(
    "UPDATE products SET product_name = $1 WHERE product_id = $2 RETURNING *",
    [product_name, product_id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: `Product '${product_id}' not found` };
  }

  return result.rows[0];
};

/**
 * Delete a product by product_id.
 * Throws if not found or if product has existing inventory batches or sales.
 */
const deleteProduct = async (product_id) => {
  // Check for foreign key references before deleting
  const batches = await pool.query(
    "SELECT id FROM inventory_batches WHERE product_id = $1 LIMIT 1",
    [product_id]
  );
  if (batches.rows.length > 0) {
    throw { status: 409, message: `Cannot delete product '${product_id}': it has existing inventory batches` };
  }

  const sales = await pool.query(
    "SELECT id FROM sales WHERE product_id = $1 LIMIT 1",
    [product_id]
  );
  if (sales.rows.length > 0) {
    throw { status: 409, message: `Cannot delete product '${product_id}': it has existing sales records` };
  }

  const result = await pool.query(
    "DELETE FROM products WHERE product_id = $1 RETURNING *",
    [product_id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: `Product '${product_id}' not found` };
  }

  return result.rows[0];
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
