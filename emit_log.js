const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();
  const queue = "task_queue";
  const msg = process.argv.slice(2).join(" ");

  ch.assertExchange("logs", "fanout", { durable: false });
  ch.publish("logs", "", Buffer.from(msg));

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 1000);
})();
