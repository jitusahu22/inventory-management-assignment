const { getLedger } = require("../services/ledgerService");

/**
 * GET /api/ledger
 * Returns the full transaction ledger ordered by timestamp.
 */
const ledger = async (req, res) => {
  try {
    const transactions = await getLedger();
    return res.status(200).json({ ledger: transactions });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { ledger };
