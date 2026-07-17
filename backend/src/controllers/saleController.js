const { processSale } = require("../services/saleService");

/**
 * POST /api/sale
 * Processes a sale using FIFO cost calculation.
 */
const sale = async (req, res) => {
  try {
    const { product_id, quantity, timestamp } = req.body;
    const saleRecord = await processSale(product_id, quantity, timestamp);
    return res.status(201).json({ message: "Sale recorded", sale: saleRecord });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { sale };
