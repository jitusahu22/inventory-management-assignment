const { processPurchase } = require("../services/purchaseService");

/**
 * POST /api/purchase
 * Creates a new inventory batch.
 */
const purchase = async (req, res) => {
  try {
    const { product_id, quantity, unit_price, timestamp } = req.body;
    const batch = await processPurchase(product_id, quantity, unit_price, timestamp);
    return res.status(201).json({ message: "Purchase recorded", batch });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { purchase };
