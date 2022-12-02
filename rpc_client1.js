const amqp = require("amqplib");

(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const ch = await connection.createChannel();
    const args = process.argv.slice(2);
    const num = +args[0]
    const q = await ch.assertQueue('', {
      exclusive:true
    })
    const correlationId = generateUuid()
    ch.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
      replyTo: q.queue,
      correlationId: correlationId
    });
    ch.consume(q.queue, (msg) => {
      if(msg.properties.correlationId == correlationId){
        console.log('got the answer: ', msg.content.toString());
        setTimeout(() => {
          connection.close()
          process.exit(0)
        },2000)
      }
    },{
      noAck: true
    })
    
  } catch (error) {
    console.log(error.message);
  }
})();
function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}


