const { getInventorySummary } = require("../services/inventoryService");

/**
 * GET /api/inventory
 * Returns stock overview for all products.
 */
const getInventory = async (req, res) => {
  try {
    const inventory = await getInventorySummary();
    return res.status(200).json({ inventory });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { getInventory };
