const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const saleRoutes = require("./routes/saleRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");

const app = express();

// --------------- Middleware ---------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "inventory-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

// --------------- Routes ---------------
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/ledger", ledgerRoutes);

module.exports = app;
