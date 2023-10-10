/*
* (later - create: cron job entries)
* (later - query: pagination, more filters)
* (later with cronJobService: clear logs >30 days old)
* */
const _ = require("lodash");
const rabbitMQ = require("../../rabbitMQUtils");
const mongoose = require("mongoose");
const Log = require("../../db-models/Log");
const exchange = rabbitMQ.exchange, queues = rabbitMQ.queues, keys = rabbitMQ.keys;

let mqClient;
const connectToRabbitMQ = async () => {
    mqClient = await rabbitMQ.getMQClient();
    await Promise.all([
        mqClient.channel.assertExchange(exchange.name, "topic", exchange.options),
        mqClient.channel.assertQueue(queues.logs.name, queues.logs.options),
        mqClient.channel.bindQueue(queues.logs.name, exchange.name, keys.userLogs)
    ]).then(() => {
        console.log("LogService - MQ exchanges and queues asserted")
    });
    mqClient.channel.consume(queues.logs.name, (message) => {
        createFromQueueMessage(message);
    });
};
connectToRabbitMQ();

// todo create util function for inserting activity logs
const createFromQueueMessage = (message) => {
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
            res.status(500).json({
                message: "Internal server error - failed to fetch logs",
                error: error
            });
        });
};

exports.search = search;