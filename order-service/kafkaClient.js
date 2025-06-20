// kafkaClient.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-producer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log('Kafka producer connected');
}

module.exports = { producer, connectProducer };
