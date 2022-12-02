const amqp = require("amqplib");

(async () => {
  const args = process.argv.slice(2);

  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();

  const exchange = "direct_logs";

  ch.assertExchange(exchange, "direct", {
    durable: false,
  });

  const q = await ch.assertQueue("", {
    exclusive: true,
  });

  console.log(" [*] Waiting for logs. To exit press CTRL+C");

  args.forEach(function (severity) {
    ch.bindQueue(q.queue, exchange, severity);
  });

  ch.consume(
    q.queue,
    (msg) => {
      console.log(
        " [x] %s: '%s'",
        msg.fields.routingKey,
        msg.content.toString()
      );
    },
    {
      noAck: true,
    }
  );
})();
