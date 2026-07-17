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

const SaleForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        product_id: formData.product_id,
        quantity: parseInt(formData.quantity, 10),
        timestamp: new Date().toISOString(),
      };

      const response = await api.post("/sale", payload);
      setSuccessMsg(`Sale successful! Cost: $${response.data.sale.total_cost}`);
      setFormData({ product_id: "", quantity: "" });
      onSuccess();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Sale failed");
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
          Record Sale
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        
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
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: "auto",
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Processing..." : "Process Sale (FIFO)"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SaleForm;
