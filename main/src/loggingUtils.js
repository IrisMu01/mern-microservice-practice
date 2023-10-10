const rabbitMQ = require("./rabbitMQUtils");
const exchange = rabbitMQ.exchange, queues = rabbitMQ.queues, keys = rabbitMQ.keys;

let mqClient;
const connectToRabbitMQ = async () => {
    mqClient = await rabbitMQ.getMQClient();
    await Promise.all([
        mqClient.channel.assertExchange(exchange.name, "topic", exchange.options),
        mqClient.channel.assertQueue(queues.logs.name, queues.logs.options)
    ]).then(() => {
        console.log("AuthService - MQ exchanges and queues asserted");
    });
};
connectToRabbitMQ();

const createUserLog = (userId, logMessage) => {
    const sourceLog = {
        logType: "user",
        user: userId,
        created: new Date(),
        message: logMessage
    };
    mqClient.channel.publish(exchange.name, keys.userLogs, Buffer.from(JSON.stringify(sourceLog)));
}

exports.createUserLog = createUserLog;