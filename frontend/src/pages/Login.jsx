import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import api from "../api/api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      onLogin(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <Card
        sx={{
          width: 400,
          maxWidth: "90vw",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          bgcolor: "#1e293b",
          color: "#f1f5f9",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <InventoryIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Inventory Management
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#f1f5f9",
                  "& fieldset": { borderColor: "#334155" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#94a3b8" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#f1f5f9",
                  "& fieldset": { borderColor: "#334155" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: "#3b82f6",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
