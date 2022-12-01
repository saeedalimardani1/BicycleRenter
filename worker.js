const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();
  const queue = "task_queue";

  ch.assertQueue(queue, {
    durable: false,
  });

  console.log("waiting for messeges");
  ch.prefetch(1);
  ch.consume(
    queue,
    (msg) => {
      const secs = msg.content.toString().split(".").length - 1;

      console.log("recieved: ", msg.content.toString());
      setTimeout(() => {
        console.log("done");
        ch.ack(msg);
      }, secs * 1000);
    },
    {
      noAck: false,
    }
  );
})();
