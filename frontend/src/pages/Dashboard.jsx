import { useState, useEffect, useCallback } from "react";
import { Box, Grid, Container, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import StockOverview from "../components/StockOverview";
import TransactionLedger from "../components/TransactionLedger";
import PurchaseForm from "../components/PurchaseForm";
import SaleForm from "../components/SaleForm";
import api from "../api/api";

const Dashboard = ({ user, setUser }) => {
  const [inventory, setInventory] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [invRes, ledRes] = await Promise.all([
        api.get("/inventory"),
        api.get("/ledger"),
      ]);
      setInventory(invRes.data.inventory || []);
      setLedger(ledRes.data.ledger || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSuccess = useCallback(() => {
    fetchData();
    setRefreshKey((k) => k + 1);
  }, [fetchData]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a" }}>
      <Navbar user={user} onLogout={setUser} />
      
      <Container maxWidth="xl" sx={{ pt: 3, pb: 3, height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
            <CircularProgress sx={{ color: "#3b82f6" }} />
          </Box>
        ) : (
        <Grid container spacing={3} sx={{ flex: 1, minHeight: 0, m: 0, width: "100%" }}>
          {/* Left Column: Tables (2/3 width) */}
          <Grid item xs={12} lg={8} sx={{ height: "100%", pt: "0 !important" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <StockOverview inventory={inventory} />
              </Box>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <TransactionLedger ledger={ledger} />
              </Box>
            </Box>
          </Grid>
          
          {/* Right Column: Forms (1/3 width) */}
          <Grid item xs={12} lg={4} sx={{ height: "100%", pt: "0 !important" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <PurchaseForm onSuccess={handleSuccess} refreshKey={refreshKey} />
              </Box>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <SaleForm onSuccess={handleSuccess} refreshKey={refreshKey} />
              </Box>
            </Box>
          </Grid>
        </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
