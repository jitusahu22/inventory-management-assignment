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
  Chip,
} from "@mui/material";

const TransactionLedger = ({ ledger }) => {
  return (
    <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Transaction Ledger
        </Typography>
        <TableContainer component={Paper} sx={{ bgcolor: "transparent", boxShadow: "none", maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: "#1e293b", color: "#94a3b8", borderBottom: "1px solid #334155" }}>Time</TableCell>
                <TableCell sx={{ bgcolor: "#1e293b", color: "#94a3b8", borderBottom: "1px solid #334155" }}>Type</TableCell>
                <TableCell sx={{ bgcolor: "#1e293b", color: "#94a3b8", borderBottom: "1px solid #334155" }}>Product</TableCell>
                <TableCell align="right" sx={{ bgcolor: "#1e293b", color: "#94a3b8", borderBottom: "1px solid #334155" }}>Qty</TableCell>
                <TableCell align="right" sx={{ bgcolor: "#1e293b", color: "#94a3b8", borderBottom: "1px solid #334155" }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledger.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#64748b", borderBottom: "none", py: 3 }}>
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                ledger.map((txn, idx) => (
                  <TableRow key={`${txn.type}-${txn.product_id}-${txn.timestamp}-${idx}`} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>
                      {new Date(txn.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>
                      <Chip
                        label={txn.type.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: txn.type === "purchase" ? "rgba(34, 197, 94, 0.2)" : "rgba(59, 130, 246, 0.2)",
                          color: txn.type === "purchase" ? "#4ade80" : "#60a5fa",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>{txn.product_id}</TableCell>
                    <TableCell align="right" sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>{txn.quantity}</TableCell>
                    <TableCell align="right" sx={{ color: "#f1f5f9", borderBottom: "1px solid #334155" }}>
                      {txn.type === "purchase"
                        ? `₹${parseFloat(txn.unit_price || 0).toFixed(2)}/u`
                        : `₹${parseFloat(txn.total_cost || 0).toFixed(2)}`}
                    </TableCell>
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

export default TransactionLedger;
