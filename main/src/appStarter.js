require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const _ = require('lodash');

/**
 * TODO
 *  - split AuthService into AuthService and UserService; only AuthService will handle
 *    sessions
 *  - migrate logs router to LogService
 *  - connect AuthService, UserService, and LogService for user/error logs
 * */
const launch = async (params) => {
    if (_.isEmpty(params)) {
        throw new Error("The params must be defined before starting a microservice");
    }
    if (_.isEmpty(params.name)) {
        throw new Error("The microservice name must be provided");
    }
    if (!params.port) {
        throw new Error("The port must be set");
    } else if (!_.isNumber(params.port)) {
        throw new Error("The port must be a number");
    }
    
    try {
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
    
        const useDb = params.useDb || true;
        if (useDb) {
            const db = {
                url: process.env.DB_URL,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD
            }
            const uri = `mongodb+srv://${db.username}:${db.password}@${db.url}/?retryWrites=true&w=majority`;
            await mongoose.connect(uri, {useNewUrlParser: true});
            console.log("Connected to database");
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
    
        if (params.requestMapping && params.router) {
            app.use(params.requestMapping, params.router);
        }
    
        amqp.connect('amqp://localhost:5672', (error, connection) => {
            if (error) throw error;
            connection.createChannel((error2, channel) => {
                if (error2) throw error2;
                const queue = 'mern-microservice-practice';
                channel.assertQueue(queue, {
                    durable: false
                });
            });
        });
    
        app.listen(params.port, function() {
            console.log(`Microservice ${params.name} is running on port ${params.port}`);
        });
    } catch (e) {
        console.error("Failed to start app");
        console.error(e);
        process.exit(1);
    }
};

exports.launch = launch;
