const { processPurchase } = require("../services/purchaseService");

/**
 * POST /api/purchase
 * Creates a new inventory batch.
 */
const purchase = async (req, res) => {
  try {
    const { product_id, quantity, unit_price, timestamp } = req.body;

    if (!product_id || typeof product_id !== "string") {
      return res.status(400).json({ error: "product_id is required and must be a string" });
    }
    if (quantity == null || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }
    if (unit_price == null || isNaN(Number(unit_price)) || Number(unit_price) <= 0) {
      return res.status(400).json({ error: "unit_price must be a positive number" });
    }

    const batch = await processPurchase(product_id, Number(quantity), Number(unit_price), timestamp);
    return res.status(201).json({ message: "Purchase recorded", batch });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { purchase };
