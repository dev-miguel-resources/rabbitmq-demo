const amqp = require('amqplib')

// Declaración de una función asíncrona y autoejecutable
;(async () => {
  // Conectarnos de manera local con RABBITMQ mediante AMQP
  const connection = await amqp.connect('amqp://localhost')
  // Crear un canal, que es una especie de "tunnel" para enviar o recibir mensajes dentro de la conexión.
  const channel = await connection.createChannel()

  // Definimos una prop. con el nombre para la cola
  const queueName = 'queue01'
  // Declaramos una cola con un determinado nombre. Si la cola existe no la vuelve a crear y si no la crea.
  // Durable: false. La cola no sobrevive a caídas o reinicios del RabbitMQ. (Son colas temporales).
  await channel.assertQueue(queueName, { durable: false })

  // Definimos un mensaje
  const message = 'hello from rabbitmq'

  // Enviar el mensaje a la cola "queue01"
  // Rabbit procesa la data en binario, por tanto pasamos el string a Buffer(binario)
  channel.sendToQueue(queueName, Buffer.from(message))

  // Espere 4 seg. y luego: cierra la conexión con rabbitmq y termine el proceso con Node.js
  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 4000)
})()
