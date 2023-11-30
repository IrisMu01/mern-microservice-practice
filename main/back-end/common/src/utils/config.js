const _ = require("lodash");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

// A .txt file with the same name needs to be present in the secrets/files folder
// and registered inside docker-compose.
const secretNames = [
    "DB_URL",
    "DB_USERNAME",
    "DB_PASSWORD",
    "SESSION_SECRET",
    "REDIS_HOST",
    "REDIS_HOST_PORT",
    "REDIS_PASSWORD"
];

const envVariableNames = [
    "FRONT_END_URL",
    "RABBIT_MQ_URL"
];

const config = {};

if (process.env.ACTIVE_PROFILE === "dev") {
    console.log("getting secrets from local .env file");
    require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});
    _.forEach(secretNames, secretName => {
       config[secretName] = process.env[secretName];
    });
} else if (process.env.ACTIVE_PROFILE === "prod") {
    _.forEach(secretNames, secretName => {
        config[secretName] = fs.readFileSync(`/run/secrets/${secretName}`, 'utf8').trim();
    });
}

_.forEach(envVariableNames, envVariableName => {
    config[envVariableName] = process.env[envVariableName];
});

module.exports = config;
