const { pool } = require("../config/db");
const { calculateFIFO } = require("./fifoService");
const { publishSaleEvent } = require("../kafka/producer");

/**
 * Process a sale using FIFO.
 * Wraps everything in a database transaction for atomicity.
 * Publishes a Kafka event after successful commit (unless skipKafka is set).
 *
 * @param {string} product_id
 * @param {number} quantity
 * @param {string} timestamp
 * @param {object} [options]
 * @param {boolean} [options.skipKafka=false] - Skip Kafka event publishing (used by consumer)
 * @returns {object} sale record
 */
const processSale = async (product_id, quantity, timestamp, options = {}) => {
  // --- Validate required fields ---
  if (!product_id || quantity == null || !timestamp) {
    throw {
      status: 400,
      message: "product_id, quantity, and timestamp are required",
    };
  }

  // --- Validate positive quantity ---
  if (quantity <= 0) {
    throw { status: 400, message: "quantity must be a positive number" };
  }

  // --- Begin transaction ---
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // --- Verify product exists ---
    const product = await client.query(
      "SELECT product_id FROM products WHERE product_id = $1",
      [product_id]
    );

    if (product.rows.length === 0) {
      throw { status: 404, message: `Product '${product_id}' not found` };
    }

    // --- Calculate FIFO cost and update batches ---
    const totalCost = await calculateFIFO(client, product_id, quantity);

    // --- Insert sale record ---
    const result = await client.query(
      `INSERT INTO sales (product_id, quantity, total_cost, timestamp)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, quantity, totalCost, timestamp]
    );

    await client.query("COMMIT");

    const sale = result.rows[0];

    // Publish Kafka event (non-blocking — failure does not affect the API response)
    // Skip when called from Kafka consumer to prevent infinite event loops
    if (!options.skipKafka) {
      await publishSaleEvent(sale);
    }

    return sale;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { processSale };
