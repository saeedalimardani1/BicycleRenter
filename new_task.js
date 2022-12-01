const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();
  const queue = "task_queue";
  const msg = process.argv.slice(2).join(" ");

  ch.assertQueue(queue, {
    durable: false,
  });

  ch.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
  });
  console.log("sent", msg);

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 1000);
})();
