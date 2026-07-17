const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { getInventory } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", isAuthenticated, getInventory);

module.exports = router;
