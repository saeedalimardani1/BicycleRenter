const amqp = require('amqplib');

(async() => {

    const connection = await amqp.connect('amqp://localhost:5672')
    const ch = await connection.createChannel();
    const queue = 'hello'
    const msg = 'hello world man'
    
    ch.assertQueue(queue,{
        durable: false
    })

    ch.sendToQueue(queue, Buffer.from(msg))
    console.log('sent',msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    },1000);

})()