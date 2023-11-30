const mongoose = require('mongoose');
const User = require('./User');

// time, message, log type
// user logs: user, request URI, IP
// (later) cron job logs: job/job name
// error logs: stack trace
const logSchema = new mongoose.Schema({
    created: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    logType: {
        type: String,
        required: true,
        enum: ["user", "cron job", "error"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    requestURI: {
        type: String
    },
    ipAddress: {
        type: String
    },
    stackTrace: {
        type: String
    }
});

module.exports = Log = mongoose.model('log', logSchema);