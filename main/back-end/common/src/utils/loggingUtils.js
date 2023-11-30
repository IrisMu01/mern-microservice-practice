const rabbitMQ = require("./rabbitMQUtils");
const exchange = rabbitMQ.exchange, queues = rabbitMQ.queues, keys = rabbitMQ.keys;

let mqClient;
const connectToRabbitMQ = async () => {
    mqClient = await rabbitMQ.getMQClient();
    await Promise.all([
        mqClient.channel.assertExchange(exchange.name, "topic", exchange.options),
        mqClient.channel.assertQueue(queues.logs.name, queues.logs.options)
    ]).then(() => {
        console.log("Logging Utils - MQ exchanges and queues asserted");
    });
};
connectToRabbitMQ();

const createUserLog = (req, userId, logMessage) => {
    const sourceLog = {
        logType: "user",
        user: userId,
        requestURI: req.url,
        ipAddress: req.ip, // load balancers/proxies may affect current implementation
        created: new Date(),
        message: logMessage
    };
    mqClient.channel.publish(exchange.name, keys.userLogs, Buffer.from(JSON.stringify(sourceLog)));
}

const createErrorLog = (req, error) => {
    if (!error) {
        console.error("Unable to create error log - no error supplied");
        return;
    }
    const sourceLog = {
        logType: "error",
        created: new Date(),
        message: error.message || "No error message provided",
        stackTrace: error.trace
    };
    if (req) {
        sourceLog.requestURI = req.url;
        sourceLog.ipAddress = req.ip;
        if (req.session) {
            sourceLog.user = req.session.userId;
        }
    }
    mqClient.channel.publish(exchange.name, keys.errorLogs, Buffer.from(JSON.stringify(sourceLog)));
}

exports.createUserLog = createUserLog;
exports.createErrorLog = createErrorLog;