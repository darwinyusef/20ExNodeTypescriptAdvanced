// consumer.js
const { Kafka } = require('kafkajs');

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'my-app-consumer', // Un identificador único para esta instancia del consumidor
  brokers: ['localhost:9092'], // Reemplaza con la dirección de tu broker de Kafka
});

const consumer = kafka.consumer({ groupId: 'mi-grupo-consumidor' }); // Define un ID de grupo para el consumidor
const topic = 'mi-topico'; // El nombre del tópico del que consumiremos mensajes

async function runConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true }); // Suscribirse al tópico y consumir desde el principio si no hay offset guardado

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          key: message.key.toString(),
          value: message.value.toString(),
        });
      },
    });
  } catch (error) {
    console.error('Error al consumir mensajes:', error);
  }
}

runConsumer();