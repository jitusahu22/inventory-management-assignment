import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import api from "../api/api";

const Products = ({ user, setUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newProduct, setNewProduct] = useState({ product_id: "", product_name: "" });
  const [editProduct, setEditProduct] = useState({ product_id: "", product_name: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  
  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products.");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/products", newProduct);
      setSuccess("Product created successfully!");
      setNewProduct({ product_id: "", product_name: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (product) => {
    setEditProduct({ product_id: product.product_id, product_name: product.product_name });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.put(`/products/${editProduct.product_id}`, { product_name: editProduct.product_name });
      setSuccess("Product updated successfully!");
      setIsEditDialogOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpen = (id) => {
    setDeleteProductId(id);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/products/${deleteProductId}`);
      setSuccess("Product deleted successfully!");
      setDeleteProductId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a" }}>
      <Navbar user={user} onLogout={setUser} />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ color: "#f1f5f9", mb: 4, fontWeight: 600 }}>
          Products Management
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Create Product Card */}
          <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Add New Product
              </Typography>
              <Box component="form" onSubmit={handleCreate} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField
                  name="product_id"
                  label="Product ID"
                  size="small"
                  required
                  value={newProduct.product_id}
                  onChange={(e) => setNewProduct({ ...newProduct, product_id: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { color: "#f1f5f9" }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
                />
                <TextField
                  name="product_name"
                  label="Product Name"
                  size="small"
                  required
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { color: "#f1f5f9" }, "& .MuiInputLabel-root": { color: "#94a3b8" }, flexGrow: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#3b82f6",
                    "&:hover": { bgcolor: "#2563eb" },
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Create Product
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Products List Table */}
          <TableContainer component={Paper} sx={{ bgcolor: "#1e293b" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Product ID</TableCell>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Product Name</TableCell>
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ color: "#94a3b8", textAlign: "center", py: 3 }}>
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell sx={{ color: "#f1f5f9" }}>{product.product_id}</TableCell>
                      <TableCell sx={{ color: "#f1f5f9" }}>{product.product_name}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          sx={{ color: "#3b82f6" }}
                          onClick={() => handleEditOpen(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#ef4444" }}
                          onClick={() => handleDeleteOpen(product.product_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#1e293b", color: "#f1f5f9" } }}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box component="form" id="edit-form" onSubmit={handleEditSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: "300px" }}>
            <TextField
              label="Product ID"
              size="small"
              value={editProduct.product_id}
              disabled
              sx={{ "& .MuiOutlinedInput-root": { color: "#94a3b8" }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
            />
            <TextField
              label="Product Name"
              size="small"
              required
              value={editProduct.product_name}
              onChange={(e) => setEditProduct({ ...editProduct, product_name: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { color: "#f1f5f9" }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditDialogOpen(false)} sx={{ color: "#94a3b8", textTransform: "none" }}>Cancel</Button>
          <Button type="submit" form="edit-form" variant="contained" disabled={loading} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none" }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProductId} onClose={() => setDeleteProductId(null)} PaperProps={{ sx: { bgcolor: "#1e293b", color: "#f1f5f9" } }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete product "{deleteProductId}"? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteProductId(null)} sx={{ color: "#94a3b8", textTransform: "none" }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" disabled={loading} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!error || !!success} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} variant="filled" sx={{ width: "100%" }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
