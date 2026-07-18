import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Inventory2 as InventoryIcon, Logout as LogoutIcon, Dashboard as DashboardIcon, ListAlt as ProductsIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      onLogout(null);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1e293b", backgroundImage: "none" }}>
      <Toolbar>
        <InventoryIcon sx={{ mr: 2, color: "#3b82f6" }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mr: 4 }}>
          Inventory Management
        </Typography>
        
        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              textTransform: "none",
              color: location.pathname === "/dashboard" ? "#3b82f6" : "#f1f5f9",
              fontWeight: location.pathname === "/dashboard" ? 600 : 400,
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<ProductsIcon />}
            onClick={() => navigate("/products")}
            sx={{
              textTransform: "none",
              color: location.pathname === "/products" ? "#3b82f6" : "#f1f5f9",
              fontWeight: location.pathname === "/products" ? 600 : 400,
            }}
          >
            Products
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Welcome, {user?.username}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              textTransform: "none",
              color: "#f1f5f9",
              "&:hover": { color: "#ef4444" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
