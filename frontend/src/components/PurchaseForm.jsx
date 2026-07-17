import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import api from "../api/api";

const PurchaseForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    unit_price: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        product_id: formData.product_id,
        quantity: parseInt(formData.quantity, 10),
        unit_price: parseFloat(formData.unit_price),
        timestamp: new Date().toISOString(),
      };

      await api.post("/purchase", payload);
      setFormData({ product_id: "", quantity: "", unit_price: "" });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Record Purchase
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            name="product_id"
            label="Product ID"
            size="small"
            required
            value={formData.product_id}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { color: "#f1f5f9" }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            size="small"
            required
            inputProps={{ min: 1 }}
            value={formData.quantity}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { color: "#f1f5f9" }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
          />
          <TextField
            name="unit_price"
            label="Unit Price ($)"
            type="number"
            size="small"
            required
            inputProps={{ min: 0.01, step: "0.01" }}
            value={formData.unit_price}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { color: "#f1f5f9" }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#22c55e",
              "&:hover": { bgcolor: "#16a34a" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Processing..." : "Add Inventory"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PurchaseForm;
