const amqp = require('amqplib')

const args = process.argv.slice(2)

;(async () => {
  // Conectarnos de manera local con RABBITMQ mediante AMQP
  const connection = await amqp.connect('amqp://localhost')
  // Crear un canal, que es una especie de "tunnel" para enviar o recibir mensajes dentro de la conexión.
  const channel = await connection.createChannel()

  const exchangeName = 'exchange-direct'

  await channel.assertExchange(exchangeName, 'direct', { durable: true })

  const assertQueue = await channel.assertQueue('', { exclusive: true })

  const routingKey = args.length > 1 ? args[1] : 'key-direct'

  // Esta cola del canal solo recibirá mensajes publicados al exchange con una routing exacta.
  await channel.bindQueue(assertQueue.queue, exchangeName, routingKey)

  const noAck = args.length > 0 ? true : false

  channel.consume(
    assertQueue.queue,
    (message) => console.log(message.content.toString()),
    { noAck },
  )
})()
