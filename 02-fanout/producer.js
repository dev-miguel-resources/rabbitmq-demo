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

  // node productor.js "Hola Mundo"
  const message = args.length > 0 ? args[0] : 'message default'

  // Lo publica el mensaje en el exchange sin routing key (routing key en fanout son irrelevantes).
  channel.publish(exchangeName, '', Buffer.from(message))

  // Espere 4 seg. y luego: cierra la conexión con rabbitmq y termine el proceso con Node.js
  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 4000)
})()
