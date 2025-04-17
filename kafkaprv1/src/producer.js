// producer.js
const { Kafka } = require('kafkajs');

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'my-app-producer', // Un identificador único para esta instancia del productor
  brokers: ['localhost:9092'], // Reemplaza con la dirección de tu broker de Kafka
});

const producer = kafka.producer();
const topic = 'mi-topico'; // El nombre del tópico al que enviaremos mensajes

async function runProducer() {
  try {
    await producer.connect();
    const message = {
      key: 'mensaje-1',
      value: `Hola desde el productor de Node.js a las ${new Date().toLocaleTimeString()}`,
    };

    const result = await producer.send({
      topic,
      messages: [message],
    });

    console.log('Mensaje enviado con éxito:', result);
    await producer.disconnect();
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
}

runProducer();