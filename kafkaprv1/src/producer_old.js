const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;

const client = new Client({
  kafkaHost: '172.18.0.2:9092'
});

const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Producer is ready');
  
  const payloads = [
    { topic: 'test-topic', messages: 'Hello Kafka', partition: 0 }
  ];
  
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending message', err);
    } else {
      console.log('Message sent', data);
    }
  });
});

producer.on('error', (err) => {
  console.error('Error in producer', err);
});