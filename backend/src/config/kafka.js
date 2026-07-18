const { Kafka } = require("kafkajs");

const broker = process.env.KAFKA_BROKER;

const config = {
  clientId: process.env.KAFKA_CLIENT_ID || "inventory-management",
  brokers: [broker],
};

// Auto-enable SSL/SASL when credentials are provided (managed Kafka services)
if (process.env.KAFKA_API_KEY && process.env.KAFKA_API_SECRET) {
  config.ssl = true;
  config.sasl = {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_API_SECRET,
  };
}

const kafka = new Kafka(config);

module.exports = kafka;
