const { pool } = require("../config/db");

/**
 * Get the transaction ledger.
 * Returns all purchases and sales merged into a single
 * chronological list, ordered by timestamp.
 *
 * Each purchase entry includes unit_price.
 * Each sale entry includes total_cost (FIFO-calculated).
 */
const getLedger = async () => {
  const result = await pool.query(
    `SELECT
       'purchase' AS type,
       product_id,
       quantity,
       unit_price,
       (quantity * unit_price)::NUMERIC AS total_cost,
       timestamp
     FROM inventory_batches

     UNION ALL

     SELECT
       'sale' AS type,
       product_id,
       quantity,
       (total_cost / quantity)::NUMERIC AS unit_price,
       total_cost,
       timestamp
     FROM sales

     ORDER BY timestamp DESC`
  );

  return result.rows;
};

module.exports = { getLedger };
