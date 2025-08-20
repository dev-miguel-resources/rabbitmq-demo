const amqp = require('amqplib')

const args = process.argv.slice(2)

;(async () => {
  // Conectarnos de manera local con RABBITMQ mediante AMQP
  const connection = await amqp.connect('amqp://localhost')
  // Crear un canal, que es una especie de "tunnel" para enviar o recibir mensajes dentro de la conexión.
  const channel = await connection.createChannel()

  const exchangeName = 'exchange-topic'

  await channel.assertExchange(exchangeName, 'topic', { durable: true })

  const q = await channel.assertQueue('', { exclusive: true })

  // # (hash): escucha todo, sustituye cero o más palabras.
  // * (asterisco): sustituye solo una palabra de la routing key.
  const routingKey = args.length > 0 ? args[0] : '#'

  // Esta cola del canal solo recibirá mensajes publicados al exchange con una routing exacta.
  await channel.bindQueue(q.queue, exchangeName, routingKey)

  console.log(
    `[*] Esperando mensajes con patrón "${routingKey}". Para salir, presione CTRL+C`,
  )

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log(
          `[X] Recibido '${
            msg.fields.routingKey
          }': '${msg.content.toString()}'`,
        )
      }
    },
    { noAck: true },
  )
})()
