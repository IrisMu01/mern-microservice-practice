const _ = require("lodash");
const authUtils = require("./authUtils");
const mongoose = require("mongoose");
const User = require("../../db-models/User");
const loggingUtils = require('../../loggingUtils');

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
    
    loggingUtils.createUserLog(user.id, `User @${user.username} has logged in`);
    res.status(200).json({ message: "You have logged in" });
};

const logout = async (req, res) => {
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    loggingUtils.createUserLog(user.id, `User @${user.username} has logged out`);
    req.session.destroy();
    res.status(204).send();
}

exports.login = login;
exports.logout = logout;
