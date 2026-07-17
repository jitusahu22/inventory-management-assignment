const { pool } = require("../config/db");

/**
 * FIFO (First-In, First-Out) Cost Calculation Service.
 *
 * Consumes inventory from the oldest batches first.
 * Returns the total cost calculated across all consumed batches.
 *
 * This function is intentionally decoupled from both the REST API
 * and the sales table. It ONLY handles:
 *   1. Reading available batches (oldest first)
 *   2. Decrementing remaining_quantity
 *   3. Calculating total cost
 *
 * Later, the Kafka Consumer will call this same function
 * when it receives a sale event — no HTTP layer involved.
 *
 * @param {object} client - A pg client (from a transaction)
 * @param {string} product_id - The product being sold
 * @param {number} quantity - How many units to sell
 * @returns {number} total_cost - FIFO-calculated cost
 */
const calculateFIFO = async (client, product_id, quantity) => {
  // --- Get all available batches, oldest first ---
  const batchResult = await client.query(
    `SELECT id, remaining_quantity, unit_price
     FROM inventory_batches
     WHERE product_id = $1 AND remaining_quantity > 0
     ORDER BY timestamp ASC, id ASC`,
    [product_id]
  );

  const batches = batchResult.rows;

  let remainingToSell = quantity;
  let totalCost = 0;

  for (const batch of batches) {
    if (remainingToSell <= 0) break;

    const available = parseInt(batch.remaining_quantity);
    const unitPrice = parseFloat(batch.unit_price);

    // Consume either the full batch or only what we need
    const consume = Math.min(available, remainingToSell);

    // Accumulate cost for the units consumed from this batch
    totalCost += consume * unitPrice;

    // Decrement remaining_quantity in the database
    await client.query(
      `UPDATE inventory_batches
       SET remaining_quantity = remaining_quantity - $1
       WHERE id = $2`,
      [consume, batch.id]
    );

    remainingToSell -= consume;
  }

  // --- Not enough stock across all batches ---
  if (remainingToSell > 0) {
    throw {
      status: 400,
      message: `Insufficient stock for product '${product_id}'. Short by ${remainingToSell} units.`,
    };
  }

  return parseFloat(totalCost.toFixed(2));
};

module.exports = { calculateFIFO };
