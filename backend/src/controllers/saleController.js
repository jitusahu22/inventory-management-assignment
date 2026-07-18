const { processSale } = require("../services/saleService");

/**
 * POST /api/sale
 * Processes a sale using FIFO cost calculation.
 */
const sale = async (req, res) => {
  try {
    const { product_id, quantity, timestamp } = req.body;

    if (!product_id || typeof product_id !== "string") {
      return res.status(400).json({ error: "product_id is required and must be a string" });
    }
    if (quantity == null || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const saleRecord = await processSale(product_id, Number(quantity), timestamp);
    return res.status(201).json({ message: "Sale recorded", sale: saleRecord });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { sale };
