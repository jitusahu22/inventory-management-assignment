require("dotenv").config();
const kafka = require("./src/config/kafka");

const producer = kafka.producer();

const TOPICS = {
  PURCHASES: "inventory.purchases",
  SALES: "inventory.sales",
};

// Some dummy products to simulate events for
const PRODUCTS = ["PROD-001", "PROD-002", "PROD-003", "PROD-004"];

const generateRandomPurchase = () => ({
  event_type: "PURCHASE_RECORDED",
  product_id: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  quantity: Math.floor(Math.random() * 50) + 10,
  unit_price: (Math.random() * 90 + 10).toFixed(2), // 10 to 100
  remaining_quantity: 0, // In simulation, we might not have the DB ID, but consumer logic might just need basic info or bypass DB
  id: Math.floor(Math.random() * 1000), // Fake Batch ID
  timestamp: new Date().toISOString(),
  published_at: new Date().toISOString(),
});

const generateRandomSale = () => ({
  event_type: "SALE_RECORDED",
  product_id: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
  quantity: Math.floor(Math.random() * 10) + 1,
  total_cost: 0, // Cost is calculated by consumer in DB
  id: Math.floor(Math.random() * 1000), // Fake Sale ID
  timestamp: new Date().toISOString(),
  published_at: new Date().toISOString(),
});

const runSimulator = async () => {
  if (process.env.KAFKA_ENABLED !== "true") {
    console.error("❌ KAFKA_ENABLED is not set to true in .env");
    process.exit(1);
  }

  if (!process.env.KAFKA_BROKER) {
    console.error("❌ KAFKA_BROKER is not set in .env");
    process.exit(1);
  }

  try {
    await producer.connect();
    console.log("✅ Kafka Simulator Connected to Broker:", process.env.KAFKA_BROKER);

    let eventCount = 0;

    setInterval(async () => {
      // 70% chance of sale, 30% chance of purchase
      const isPurchase = Math.random() < 0.3;
      
      const topic = isPurchase ? TOPICS.PURCHASES : TOPICS.SALES;
      const eventData = isPurchase ? generateRandomPurchase() : generateRandomSale();

      try {
        await producer.send({
          topic,
          messages: [
            {
              key: eventData.product_id,
              value: JSON.stringify(eventData),
            },
          ],
        });
        
        eventCount++;
        console.log(`[Event #${eventCount}] Published ${eventData.event_type} for ${eventData.product_id} (Qty: ${eventData.quantity})`);
      } catch (err) {
        console.error("Failed to send event:", err.message);
      }
    }, 2000); // Send 1 event every 2 seconds

  } catch (err) {
    console.error("Failed to start simulator:", err);
    process.exit(1);
  }
};

console.log("🚀 Starting Kafka Traffic Simulator...");
console.log("Press Ctrl+C to stop.");
runSimulator();
