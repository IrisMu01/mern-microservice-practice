const _ = require("lodash");
const mongoose = require("mongoose");
const Log = require("../../db-models/Log");

const create = (req, res) => {
    const sourceLog = _.cloneDeep(req.body);
    if (!sourceLog.message) {
        res.status(400).json({message: "No log message provided"});
        return;
    } else if (!sourceLog.logType) {
        res.status(400).json({message: "No log type provided"});
        return;
    }
    if (sourceLog.logType === "user") {
        if (!sourceLog.user) {
            res.status(400).json({message: "No user associated with the log"});
            return;
        }
    }
    sourceLog.created = new Date();
    sourceLog.user = new mongoose.Types.ObjectId(sourceLog.user);
    Log.create(sourceLog)
        .then(log => {
            res.json({
                id: log._id
            });
        })
        .catch(error => res.status(500).json({
            message: "Internal server error - failed to create log entry",
            error: error
        }));
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

exports.create = create;
exports.search = search;