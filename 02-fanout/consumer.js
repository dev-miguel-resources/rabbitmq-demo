const amqp = require('amqplib')

const args = process.argv.slice(2)

;(async () => {
  // Conectarnos de manera local con RABBITMQ mediante AMQP
  const connection = await amqp.connect('amqp://localhost')
  // Crear un canal, que es una especie de "tunnel" para enviar o recibir mensajes dentro de la conexión.
  const channel = await connection.createChannel()

  const exchangeName = 'exchange-fanout'

  // Creamos un exchange en el canal de tipo fanout
  await channel.assertExchange(exchangeName, 'fanout', { durable: true })

  // Creamos la cola y la vinculamos al canal
  const assertQueue = await channel.assertQueue('', { exclusive: true })

  // Con esto, la cola recibirá todos los mensajes publicados en el exchange.
  await channel.bindQueue(assertQueue.queue, exchangeName, '')

  const noAck = args.length > 0 ? true : false

  channel.consume(
    assertQueue.queue,
    (message) => console.log(message.content.toString()),
    { noAck },
  )
})()
