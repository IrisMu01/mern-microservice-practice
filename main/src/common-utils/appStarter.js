const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sessions = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const mongoose = require('mongoose');
const _ = require('lodash');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

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
        app.use(cors({
            origin: process.env.FRONT_END_URL,
            credentials: true
        }));
        app.use(bodyParser.json());
    
        const useDb = params.useDb || true;
        if (useDb) {
            const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/?retryWrites=true&w=majority`;
            await mongoose.connect(uri, {useNewUrlParser: true});
            console.log("Connected to database");
            mongoose.set("returnOriginal", false);
            mongoose.set("debug", true);
        }
    
        const redisClient = redis.createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_HOST_PORT
            }
        });
        await redisClient.connect();
        const redisStore = new RedisStore({
            client: redisClient,
            prefix: "mern-microservice-practice:"
        });
        app.use(sessions({
            store: redisStore,
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            cookie: {maxAge: 1000*60*60*24}, // one day
            resave: false
        }));
    
        if (params.requestMapping && params.router) {
            app.use(params.requestMapping, params.router);
        }
    
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
