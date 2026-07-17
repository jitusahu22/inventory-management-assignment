const { pool } = require("../config/db");

/**
 * Create a new inventory batch (purchase).
 * Validates the product exists, and that quantity/unit_price are positive.
 *
 * NOTE: Later, the Kafka Consumer will call this same function
 * when it receives a purchase event from the producer topic.
 */
const processPurchase = async (product_id, quantity, unit_price, timestamp) => {
  // --- Validate required fields ---
  if (!product_id || quantity == null || unit_price == null || !timestamp) {
    throw {
      status: 400,
      message: "product_id, quantity, unit_price, and timestamp are required",
    };
  }

  // --- Validate positive numbers ---
  if (quantity <= 0) {
    throw { status: 400, message: "quantity must be a positive number" };
  }

  if (unit_price <= 0) {
    throw { status: 400, message: "unit_price must be a positive number" };
  }

  // --- Verify product exists ---
  const product = await pool.query(
    "SELECT product_id FROM products WHERE product_id = $1",
    [product_id]
  );

  if (product.rows.length === 0) {
    throw { status: 404, message: `Product '${product_id}' not found` };
  }

  // --- Insert inventory batch ---
  const result = await pool.query(
    `INSERT INTO inventory_batches (product_id, quantity, remaining_quantity, unit_price, timestamp)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [product_id, quantity, quantity, unit_price, timestamp]
  );

  // TODO: After Kafka is integrated, publish a "purchase" event here
  // so other services can react to new inventory arrivals.

  return result.rows[0];
};

module.exports = { processPurchase };
