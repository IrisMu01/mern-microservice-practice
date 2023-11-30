const loggingUtils = require("./loggingUtils");

const badRequest = (res, message) => {
    res.status(400).json({message: message}).send();
};

const unauthorized = (res) => {
    res.status(403).json({message: "Unauthorized"}).send();
};

const internalServerError = (req, res, error) => {
    loggingUtils.createErrorLog(req, error);
    res.status(500).json({
        message: "Internal server error",
        error: error
    }).send();
};

exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
exports.internalServerError = internalServerError;
