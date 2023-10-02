const _ = require('lodash');
const connectDb = require('./connectDb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const amqp = require('amqplib/callback_api');

/**
 * TODO
 *  - test appStarter.js with auth/router.js
 *  - introduce rabbitMQ
 *  - split AuthService into AuthService and UserService; only AuthService will handle
 *    sessions
 *  - migrate logs router to LogService
 *  - connect AuthService, UserService, and LogService for user/error logs
 * */
const launch = async (params) => {
    if (_.isEmpty(params)) {
        throw new Error("The params must be defined before starting a microservice");
    }
    
    const name = params.name;
    if (_.isEmpty(name)) {
        throw new Error("The microservice name must be provided");
    }
    
    const port = params.port;
    if (_.isEmpty(port)) {
        throw new Error("The port must be set");
    } else if (!_.isNumber(port)) {
        throw new Error("The port must be a number");
    }
    
    require('dotenv').config();
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    if (params.router) {
        app.use(params.router);
    }
    
    const useDb = params.useDb || true;
    if (useDb) {
        await connectDb();
        // todo mongoose part - investigate whether scoping here makes a difference
        const mongoose = require('mongoose');
        mongoose.set("returnOriginal", false);
        mongoose.set("debug", true);
    }
    
    const manageSessions = params.manageSessions || false;
    if (manageSessions) {
        app.use(sessions({
            secret: process.env.SESSION_SECRET,
            saveUninitialized: true,
            cookie: {maxAge: 1000*60*60*24}, // one day
            resave: false
        }));
        app.use(cookieParser());
    }
    
    /*amqp.connect('amqp://localhost:15672', (error, connection) => {
    if (error) throw error;
    console.log(connection);
    connection.createChannel((error2, channel) => {
        if (error2) throw error2;
        const queue = 'mern-microservice-practice';
        channel.assertQueue(queue, {
            durable: false
        });
    })
});*/
    
    app.listen(port, function() {
        console.log(`Microservice ${name} is running on port ${port}`);
    });
};

exports.launch = launch;
