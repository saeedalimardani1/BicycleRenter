const amqp = require("amqplib");

(async () => {
  const args = process.argv.slice(2);

  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();

  const q = await ch.assertQueue("rpc_queue", {
    durable: false,
  });

  ch.prefetch(1);
  console.log("awaiting rpc req");

  ch.consume(
    q.queue,
    (msg) => {
      const n = parseInt(msg.content.toString());
      const answer = fib(n);
      ch.sendToQueue(msg.properties.replyTo, Buffer.from(answer.toString()), {
        correlationId: msg.properties.correlationId,
      });
    },
    {
      noAck: true,
    }
  );
})();

function fib(n) {
  if (n == 0 || n == 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
