const _ = require("lodash");
const authUtils = require("./authUtils");
const mongoose = require("mongoose");
const User = require("../../db-models/User");
const rabbitMQ = require("../../rabbitMQUtils");
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

const login = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(403).json({ message: "Username or password cannot be empty" });
        return;
    }
    const user = await User.findOne({username: req.body.username});
    if (!user || !authUtils.compare(req.body.password, user.password)) {
        res.status(403).json({ message: "Invalid credentials" });
        return;
    } else if (user.lockedReason) {
        res.status(403).json({ message: `User cannot login now - ${user.lockedReason}` });
        return;
    }
    req.session.userId = user.id;
    
    const sourceLog = {
        logType: "user",
        user: user.id,
        created: new Date(),
        message: `User @${user.username} has logged in`
    };
    mqClient.channel.publish(exchange.name, keys.userLogs, Buffer.from(JSON.stringify(sourceLog)));
    res.status(200).json({ message: "You have logged in" });
};

const logout = async (req, res) => {
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    const sourceLog = {
        logType: "user",
        user: user.id,
        created: new Date(),
        message: `User @${user.username} has logged out`
    };
    mqClient.channel.publish(exchange.name, keys.userLogs, Buffer.from(JSON.stringify(sourceLog)));
    
    req.session.destroy();
    res.status(204).send();
}

exports.login = login;
exports.logout = logout;
