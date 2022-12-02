const amqp = require("amqplib");

(async () => {
  try {
    
    const connection = await amqp.connect("amqp://localhost:5672");
    const ch = await connection.createChannel();
    const args = process.argv.slice(2);
    console.log(args);
    const msg = args.slice(1).join(" ") || "Hello World!";
    const key = args.length > 0 ? args[0] : "anonymous.info";
    const exchange = "topic_logs";
  
    ch.assertExchange(exchange, "topic", {
      durable: false,
    });
    ch.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.log(error.message); 
  }
})();
