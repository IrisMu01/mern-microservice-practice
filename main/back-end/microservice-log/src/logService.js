/*
* (later - create: cron job entries)
* (later - query: pagination, more filters)
* (later with cronJobService: clear logs >30 days old)
* */
const _ = require("lodash");
const config = require("../../common/src/utils/config");
const rabbitMQ = require("../../common/src/utils/rabbitMQUtils");
const sqs = require("../../common/src/utils/awsSqsUtils");
const mongoose = require("mongoose");
const Log = require("../../common/src/db-models/Log");
const exchange = rabbitMQ.exchange, queues = rabbitMQ.queues, keys = rabbitMQ.keys;
const apiErrorUtils = require("../../common/src/utils/apiErrorUtils");
const { DeleteMessageCommand, ReceiveMessageCommand} = require("@aws-sdk/client-sqs");

let mqClient;
let awsQueue;

const connectAndListenToRabbitMQ = async () => {
    mqClient = await rabbitMQ.getMQClient();
    await Promise.all([
        mqClient.channel.assertExchange(exchange.name, "topic", exchange.options),
        mqClient.channel.assertQueue(queues.logs.name, queues.logs.options),
        mqClient.channel.bindQueue(queues.logs.name, exchange.name, keys.generalLogs)
    ]).then(() => {
        console.log("LogService - MQ exchanges and queues asserted")
    });
    mqClient.channel.consume(queues.logs.name, (message) => {
        createLogRabbitMQImpl(message);
    });
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const connectAndListenToSQS = async() => {
    awsQueue = await sqs.connect();
    console.log("connectToSQS - success")
    
    // todo switch to using aws lambda to replace the current busy-wait implementation
    while (true) {
        await receiveSQSMessage();
        await sleep(40000);
    }
}

const receiveSQSMessage = async () => {
    const receiveMessageCommand = new ReceiveMessageCommand({
        AttributeNames: ["timestamp", "logType"],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ["All"],
        QueueUrl: awsQueue.url,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20
    });
    
    const { Messages } = await awsQueue.client.send(receiveMessageCommand);
    if (Messages) {
        _.forEach(Messages, message => {
            createLogSQSImpl(message);
        });
    }
};

const useSQS = config["MESSAGE_QUEUE_MODE"] !== "RABBIT_MQ";
if (!useSQS) {
    connectAndListenToRabbitMQ();
} else {
    connectAndListenToSQS();
}

const createLogRabbitMQImpl = (message) => {
    const sourceLog = JSON.parse(message.content.toString());
    if (!sourceLog.message) {
        console.error("No log message provided - " + sourceLog);
        mqClient.channel.nack(message, false, false);
        return;
    } else if (!sourceLog.logType) {
        console.error("No log type provided - " + sourceLog);
        mqClient.channel.nack(message, false, false);
        return;
    }
    if (sourceLog.logType === "user") {
        if (!sourceLog.user) {
            console.error("No user associated with the log - " + sourceLog);
            mqClient.channel.nack(message, false, false);
            return;
        }
    }
    Log.create(sourceLog)
        .then(log => mqClient.channel.ack(message))
        .catch(error => {
            console.error("Internal server error - failed to create log entry");
            console.error(error);
            mqClient.channel.nack(message, false, true)
        });
};

const createLogSQSImpl = (message) => {
    const sourceLog = JSON.parse(message.Body.toString());
    let createLog = true;
    
    if (!sourceLog.message) {
        console.error("No log message provided - " + sourceLog);
        createLog = false;
    } else if (!sourceLog.logType) {
        console.error("No log type provided - " + sourceLog);
        createLog = false;
    }
    if (sourceLog.logType === "user") {
        if (!sourceLog.user) {
            console.error("No user associated with the log - " + sourceLog);
            createLog = false;
        }
    }
    
    const deleteMessageCommand = new DeleteMessageCommand({
        QueueUrl: awsQueue.url,
        ReceiptHandle: message.ReceiptHandle
    });
    
    if (createLog) {
        Log.create(sourceLog)
            .then(awsQueue.client.send(deleteMessageCommand))
            .catch(error => {
                console.error("Internal server error - failed to create log entry");
                console.error(error);
            });
    } else {
        awsQueue.client.send(deleteMessageCommand);
    }
};

const search = (req, res) => {
    const findQuery = {};
    if (req.query.user) {
        findQuery.user = new mongoose.Types.ObjectId(req.query.user);
    }
    if (req.query.startDate || req.query.endDate) {
        findQuery.created = {};
        if (req.query.startDate) {
            findQuery.created.$gte = req.query.startDate;
        }
        if (req.query.endDate) {
            findQuery.created.$lt = req.query.endDate;
        }
    }
    if (_.isEmpty(findQuery)) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        findQuery.created.$gte = sevenDaysAgo;
    }
    const sortQuery = req.query.sort || "-created";
    
    Log.find(findQuery).sort(sortQuery).exec()
        .then(docs => {
            res.json({
                query: req.query,
                results: docs
            });
        })
        .catch(error => {
            apiErrorUtils.internalServerError(req, res, error);
        });
};

exports.search = search;
