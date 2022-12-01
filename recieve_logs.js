const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();

  const exchange = "logs";

  ch.assertExchange(exchange, "fanout", {
    durable: false,
  });

  const q = await ch.assertQueue("", {
    exclusive: true,
  });

  console.log("waiting for messeges: ", q.queue);

  ch.bindQueue(q.queue, exchange, "");

  ch.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("recieved: ", msg.content.toString());
      }
    },
    {
      noAck: true,
    }
  );
})();
