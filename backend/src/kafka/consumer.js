const kafka = require("../config/kafka");
const { processPurchase } = require("../services/purchaseService");
const { processSale } = require("../services/saleService");

const TOPICS = {
  PURCHASES: "inventory.purchases",
  SALES: "inventory.sales",
};

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP || "inventory-consumer-group",
});

let isRunning = false;

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Kafka Consumer connected successfully");

    await consumer.subscribe({ topic: TOPICS.PURCHASES, fromBeginning: false });
    await consumer.subscribe({ topic: TOPICS.SALES, fromBeginning: false });
    console.log(`[Kafka Consumer] Subscribed to topics: ${Object.values(TOPICS).join(", ")}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (!value) {
          console.warn(`[Kafka Consumer] Empty message received on topic '${topic}'`);
          return;
        }

        let event;
        try {
          event = JSON.parse(value);
        } catch (parseError) {
          console.error(`[Kafka Consumer] Failed to parse message on topic '${topic}':`, parseError.message);
          return;
        }

        console.log(`[Kafka Consumer] Received event on topic '${topic}':`, event.event_type);

        try {
          if (topic === TOPICS.PURCHASES && event.event_type === "PURCHASE_RECORDED") {
            console.log(`[Kafka Consumer] Processing purchase for product '${event.product_id}'`);
            await processPurchase(
              event.product_id,
              event.quantity,
              event.unit_price,
              event.timestamp,
              { skipKafka: true }
            );
            console.log(`[Kafka Consumer] Purchase processed successfully for product '${event.product_id}'`);
          } else if (topic === TOPICS.SALES && event.event_type === "SALE_RECORDED") {
            console.log(`[Kafka Consumer] Processing sale for product '${event.product_id}'`);
            await processSale(
              event.product_id,
              event.quantity,
              event.timestamp,
              { skipKafka: true }
            );
            console.log(`[Kafka Consumer] Sale processed successfully for product '${event.product_id}'`);
          } else {
            console.warn(`[Kafka Consumer] Unknown event type '${event.event_type}' on topic '${topic}'`);
          }
        } catch (processingError) {
          console.error(`[Kafka Consumer] Error processing event on topic '${topic}':`, processingError.message);
        }
      },
    });

    isRunning = true;
  } catch (error) {
    console.warn("Kafka Consumer connection failed:", error.message);
    console.warn("Kafka consumer will not process events. REST API continues to work normally.");
    isRunning = false;
  }
};

const stopConsumer = async () => {
  if (isRunning) {
    try {
      await consumer.disconnect();
      isRunning = false;
      console.log("Kafka Consumer disconnected");
    } catch (error) {
      console.warn("Kafka Consumer disconnect error:", error.message);
    }
  }
};

module.exports = { runConsumer, stopConsumer };
