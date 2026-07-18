const kafka = require("../config/kafka");

const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  try {
    await producer.connect();
    isConnected = true;
    console.log("Kafka Producer connected successfully");
  } catch (error) {
    console.warn("Kafka Producer connection failed:", error.message);
    console.warn("Kafka events will not be published. REST API continues to work normally.");
    isConnected = false;
  }
};

const disconnectProducer = async () => {
  if (isConnected) {
    try {
      await producer.disconnect();
      isConnected = false;
      console.log("Kafka Producer disconnected");
    } catch (error) {
      console.warn("Kafka Producer disconnect error:", error.message);
    }
  }
};

const publishEvent = async (topic, message) => {
  if (!isConnected) {
    console.warn(`[Kafka] Producer not connected. Skipping publish to topic: ${topic}`);
    return null;
  }

  try {
    const result = await producer.send({
      topic,
      messages: [
        {
          key: message.product_id || "unknown",
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`[Kafka] Published event to topic '${topic}':`, result);
    return result;
  } catch (error) {
    console.error(`[Kafka] Failed to publish event to topic '${topic}':`, error.message);
    return null;
  }
};

const publishPurchaseEvent = async (batchData) => {
  return publishEvent("inventory.purchases", {
    event_type: "PURCHASE_RECORDED",
    product_id: batchData.product_id,
    quantity: batchData.quantity,
    unit_price: batchData.unit_price,
    remaining_quantity: batchData.remaining_quantity,
    batch_id: batchData.id,
    timestamp: batchData.timestamp,
    published_at: new Date().toISOString(),
  });
};

const publishSaleEvent = async (saleData) => {
  return publishEvent("inventory.sales", {
    event_type: "SALE_RECORDED",
    product_id: saleData.product_id,
    quantity: saleData.quantity,
    total_cost: saleData.total_cost,
    sale_id: saleData.id,
    timestamp: saleData.timestamp,
    published_at: new Date().toISOString(),
  });
};

module.exports = {
  connectProducer,
  disconnectProducer,
  publishPurchaseEvent,
  publishSaleEvent,
};
