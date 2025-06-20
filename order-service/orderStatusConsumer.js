// orderStatusConsumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'order-tracking-group' });

async function runConsumer(io) {
  await consumer.connect();
  console.log('✅ Kafka consumer connected');
  await consumer.subscribe({ topic: /^order\..+$/, fromBeginning: false });
  console.log('✅ Subscribed to order topics');
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log(`📨 [Kafka] message on ${topic}:`, payload);
      io.emit('order.status', payload);
      // Optional: Log to verify it's emitting
      console.log(`🔊 Emitted WebSocket event: order.status`, payload);
    },
  });
}

module.exports = { runConsumer };

