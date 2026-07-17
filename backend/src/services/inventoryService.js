const { pool } = require("../config/db");

/**
 * Get inventory summary for all products.
 *
 * For each product returns:
 *  - product_id
 *  - product_name
 *  - current_quantity   (sum of remaining_quantity across all batches)
 *  - total_inventory_cost (sum of remaining_quantity * unit_price per batch)
 *  - average_cost_per_unit (total_inventory_cost / current_quantity)
 */
const getInventorySummary = async () => {
  const result = await pool.query(
    `SELECT
       p.product_id,
       p.product_name,
       COALESCE(SUM(ib.remaining_quantity), 0)::INT AS current_quantity,
       COALESCE(SUM(ib.remaining_quantity * ib.unit_price), 0)::NUMERIC(10,2) AS total_inventory_cost
     FROM products p
     LEFT JOIN inventory_batches ib ON p.product_id = ib.product_id
     GROUP BY p.product_id, p.product_name
     ORDER BY p.product_id ASC`
  );

  const inventory = result.rows.map((row) => ({
    product_id: row.product_id,
    product_name: row.product_name,
    current_quantity: parseInt(row.current_quantity),
    total_inventory_cost: parseFloat(row.total_inventory_cost),
    average_cost_per_unit:
      parseInt(row.current_quantity) > 0
        ? parseFloat((row.total_inventory_cost / row.current_quantity).toFixed(2))
        : 0,
  }));

  return inventory;
};

module.exports = { getInventorySummary };
