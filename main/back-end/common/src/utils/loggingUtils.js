const rabbitMQ = require("./rabbitMQUtils");
const exchange = rabbitMQ.exchange, queues = rabbitMQ.queues, keys = rabbitMQ.keys;
const sqs = require("./awsSqsUtils");
const config = require("./config");
const { SendMessageCommand } = require("@aws-sdk/client-sqs");

let mqClient;
let awsQueue;
const connectToRabbitMQ = async () => {
    mqClient = await rabbitMQ.getMQClient();
    await Promise.all([
        mqClient.channel.assertExchange(exchange.name, "topic", exchange.options),
        mqClient.channel.assertQueue(queues.logs.name, queues.logs.options)
    ]).then(() => {
        console.log("Logging Utils - MQ exchanges and queues asserted");
    });
};
const connectToSQS = async () => {
    awsQueue = await sqs.connect();
}

const useSQS = config["MESSAGE_QUEUE_MODE"] !== "RABBIT_MQ";
if (!useSQS) {
    connectToRabbitMQ();
} else {
    connectToSQS();
}

const createUserLogRabbitMQImpl = (sourceLog) => {
    mqClient.channel.publish(exchange.name, keys.userLogs, Buffer.from(JSON.stringify(sourceLog)));
};

const createUserLogSQSImpl = (sourceLog) => {
    const command = new SendMessageCommand({
        DelaySeconds: 3,
        MessageAttributes: {
            "timestamp": {
                DataType: "Number",
                StringValue: new Date().getTime().toString()
            },
            "logType": {
                DataType: "String",
                StringValue: "user"
            }
        },
        MessageBody: JSON.stringify(sourceLog),
        QueueUrl: awsQueue.url
    });
    
    awsQueue.client.send(command, function(err, data) {
        if (err) {
            console.error("Error sending new user log entry to SQS", err);
        } else {
            console.log("New user log entry sent to SQS", data.MessageId);
        }
    });
};

const createUserLog = (req, userId, logMessage) => {
    const sourceLog = {
        logType: "user",
        user: userId,
        requestURI: req.url,
        ipAddress: req.ip, // load balancers/proxies may affect current implementation
        created: new Date(),
        message: logMessage
    };
    
    if (useSQS) {
        createUserLogSQSImpl(sourceLog);
    } else {
        createUserLogRabbitMQImpl(sourceLog);
    }
}

const createErrorLogRabbitMQImpl = (sourceLog) => {
    mqClient.channel.publish(exchange.name, keys.errorLogs, Buffer.from(JSON.stringify(sourceLog)));
};

const createErrorLogSQSImpl = (sourceLog) => {
    const command = new SendMessageCommand({
        DelaySeconds: 3,
        MessageAttributes: {
            "timestamp": {
                DataType: "Number",
                StringValue: new Date().getTime()
            },
            "logType": {
                DataType: "String",
                StringValue: "error"
            }
        },
        MessageBody: JSON.stringify(sourceLog),
        QueueUrl: awsQueue.url
    });
    
    awsQueue.client.send(command, function(err, data) {
        if (err) {
            console.error("Error sending new error log entry to SQS", err);
        } else {
            console.log("New error log entry sent to SQS", data.MessageId);
        }
    });
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
    
    if (useSQS) {
        createErrorLogSQSImpl(sourceLog);
    } else {
        createErrorLogRabbitMQImpl(sourceLog);
    }
}

exports.createUserLog = createUserLog;
exports.createErrorLog = createErrorLog;
