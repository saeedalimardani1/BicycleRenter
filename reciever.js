const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();
  const queue = "hello";

  ch.assertQueue(queue, {
    durable: false,
  });

  console.log('waiting for messeges');

  ch.consume(queue, (msg) => {
    console.log('recieved: ', msg.content.toString());
  },{
    noAck: true
  })

})();
