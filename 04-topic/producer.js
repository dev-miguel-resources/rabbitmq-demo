const amqp = require('amqplib')

const args = process.argv.slice(2)

;(async () => {
  // Conectarnos de manera local con RABBITMQ mediante AMQP
  const connection = await amqp.connect('amqp://localhost')
  // Crear un canal, que es una especie de "tunnel" para enviar o recibir mensajes dentro de la conexión.
  const channel = await connection.createChannel()

  const exchangeName = 'exchange-topic'

  await channel.assertExchange(exchangeName, 'topic', { durable: true })

  const message = args.length > 0 ? args[0] : 'message default'

  const routingKey = args.length > 1 ? args[1] : 'key-direct'

  // El productor publica el mensaje y la routing key mediante el canal al intercambiador
  channel.publish(exchangeName, routingKey, Buffer.from(message))

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 4000)
})()
