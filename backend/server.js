require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { connectProducer, disconnectProducer } = require("./src/kafka/producer");
const { runConsumer, stopConsumer } = require("./src/kafka/consumer");

const PORT = process.env.PORT || 5000;
const KAFKA_ENABLED = process.env.KAFKA_ENABLED === "true";

const startServer = async () => {
  await connectDB();

  // Initialize Kafka producer (non-blocking — server starts even if Kafka is unavailable)
  if (KAFKA_ENABLED) {
    if (!process.env.KAFKA_BROKER) {
      console.error("KAFKA_ENABLED=true but KAFKA_BROKER is not set. Kafka will not start.");
    } else {
      await connectProducer();
      await runConsumer();
    }
  } else {
    console.log("Kafka disabled. Set KAFKA_ENABLED=true and KAFKA_BROKER to enable.");
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Graceful shutdown
const shutdown = async () => {
  console.log("\nShutting down gracefully...");
  await stopConsumer();
  await disconnectProducer();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
