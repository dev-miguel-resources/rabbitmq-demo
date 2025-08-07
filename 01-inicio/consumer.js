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

  // Recuperar y consumir el mensaje de la cola de datos.
  channel.consume(
    queueName,
    // Para recuperar el contenido de un Buffer, se utiliza el objeto content
    (message) => console.log(message.content.toString()),
    // Te permite realizar confirmaciones de procesamiento de datos
    // NoAck: true. Quiero decir que el productor emitió la data pero la confirmación fue automática respecto al procesado.
    // noAck: false. Significa acá que hay una confirmación manual y controlada.
    { noAck: true },
  )
})()
