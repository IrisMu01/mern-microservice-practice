const _ = require("lodash");
const authUtils = require("./authUtils");
const User = require("../../db-models/User");

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
    res.status(200).json({ message: "You have logged in" });
};

const logout = async (req, res) => {
    req.session.destroy();
    res.status(204).send();
}

exports.login = login;
exports.logout = logout;
