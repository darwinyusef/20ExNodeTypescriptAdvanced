const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const Client = kafka.KafkaClient;

const client = new Client({
  kafkaHost: '172.18.0.2:9092'  // docker inspect kafka-broker1 | grep "IPAddress"
});

const consumer = new Consumer(
  client,
  [
    { topic: 'test-topic', partition: 0 }
  ],
  {
    autoCommit: true
  }
);

consumer.on('message', (message) => {
  console.log('Received message:', message.value);
});

consumer.on('error', (err) => {
  console.error('Error in consumer', err);
});
