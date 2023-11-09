const _ = require("lodash");
const authUtils = require("./authUtils");
const mongoose = require("mongoose");
const User = require("../../db-models/User");
const loggingUtils = require('../../common-utils/loggingUtils');
const apiErrorUtils = require('../../common-utils/apiErrorUtils');

const login = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        apiErrorUtils.badRequest(res, "Username or password cannot be empty");
        return;
    }
    const user = await User.findOne({username: req.body.username});
    if (!user || !authUtils.compare(req.body.password, user.password) || user.lockedReason) {
        apiErrorUtils.unauthorized(res);
        return;
    }
    req.session.userId = user.id;
    
    loggingUtils.createUserLog(req, user.id, `User @${user.username} has logged in`);
    res.status(200).json({
        message: "You have logged in",
        user: _.pick(user, ["username", "email"])
    });
};

const logout = async (req, res) => {
    if (req.session.userId) {
        const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
        loggingUtils.createUserLog(req, user.id, `User @${user.username} has logged out`);
    }
    req.session.destroy();
    res.status(204).send();
}

exports.login = login;
exports.logout = logout;
