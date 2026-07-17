const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { ledger } = require("../controllers/ledgerController");

const router = express.Router();

router.get("/", isAuthenticated, ledger);

module.exports = router;
