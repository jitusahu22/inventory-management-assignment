const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { purchase } = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", isAuthenticated, purchase);

module.exports = router;
