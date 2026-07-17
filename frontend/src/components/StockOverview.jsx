import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const StockOverview = ({ inventory }) => {
  return (
    <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Product Stock Overview
        </Typography>
        <TableContainer component={Paper} sx={{ bgcolor: "transparent", boxShadow: "none" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#94a3b8", borderBottom: "1px solid #334155" }}>Product ID</TableCell>
                <TableCell sx={{ color: "#94a3b8", borderBottom: "1px solid #334155" }}>Name</TableCell>
                <TableCell align="right" sx={{ color: "#94a3b8", borderBottom: "1px solid #334155" }}>Qty</TableCell>
                <TableCell align="right" sx={{ color: "#94a3b8", borderBottom: "1px solid #334155" }}>Avg Cost</TableCell>
                <TableCell align="right" sx={{ color: "#94a3b8", borderBottom: "1px solid #334155" }}>Total Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#64748b", borderBottom: "none", py: 3 }}>
                    No inventory data available
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => (
                  <TableRow key={item.product_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>{item.product_id}</TableCell>
                    <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>{item.product_name}</TableCell>
                    <TableCell align="right" sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>{item.current_quantity}</TableCell>
                    <TableCell align="right" sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>${item.average_cost_per_unit.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>${item.total_inventory_cost.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default StockOverview;
