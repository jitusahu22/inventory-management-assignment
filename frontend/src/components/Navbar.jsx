import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Inventory2 as InventoryIcon, Logout as LogoutIcon } from "@mui/icons-material";
import api from "../api/api";

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      onLogout(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1e293b", backgroundImage: "none" }}>
      <Toolbar>
        <InventoryIcon sx={{ mr: 2, color: "#3b82f6" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Inventory Management
        </Typography>
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
