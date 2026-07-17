const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { sale } = require("../controllers/saleController");

const router = express.Router();

router.post("/", isAuthenticated, sale);

module.exports = router;
