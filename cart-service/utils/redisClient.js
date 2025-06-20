const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

client.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch(err => console.error('❌ Redis connection failed', err));

module.exports = client;
