const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const ch = await connection.createChannel();
  const args = process.argv.slice(2);
  const msg = args.slice(1).join(" ") || "Hello World!";
  const severity = args.length > 0 ? args[0] : "info";
  const exchange = "direct_logs";

  ch.assertExchange(exchange, "direct", {
    durable: false,
  });
  ch.publish(exchange, severity, Buffer.from(msg));
  console.log(" [x] Sent %s: '%s'", severity, msg);
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 1000);
})();
