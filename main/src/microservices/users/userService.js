const _ = require("lodash");
const User = require("../../db-models/User");
const authUtils = require("../auth/authUtils");
const mongoose = require("mongoose");
const loggingUtils = require("../../common-utils/loggingUtils");
const apiErrorUtils = require("../../common-utils/apiErrorUtils");

// todo add support for sending emails containing verification code
const registerUser = async (req, res) => {
    const sourceUser = _.cloneDeep(req.body);
    if (!sourceUser.email) {
        apiErrorUtils.badRequest(res, "No email address provided");
        return;
    }
    const potentialUser = await User.findOne({username: req.body.username});
    if (!_.isEmpty(potentialUser)) {
        apiErrorUtils.badRequest(res, "A user with this username already exists");
        return;
    }
    
    sourceUser.password = authUtils.encrypt(sourceUser.password);
    sourceUser.verificationKey = authUtils.generateRandomString(12);
    sourceUser.lockedReason = "Unverified";
    User.create(sourceUser)
        .then(user => {
            loggingUtils.createUserLog(req, user.id, `User @${user.username} has been created`);
            res.json({
                id: user._id,
                message: `User @${user.username} registered successfully`,
                verificationKey: user.verificationKey
            });
        })
        .catch(error => {
            apiErrorUtils.internalServerError(req, res, error);
        });
};

const verifyUser = async (req, res) => {
    if (_.isEmpty(req.body.username)) {
        apiErrorUtils.badRequest(res, "No username provided");
        return;
    }
    const user = await User.findOne({username: req.body.username}).then(user => user);
    if (_.isEmpty(user)) {
        apiErrorUtils.badRequest(res, "No user found");
        return;
    } else if (_.isEmpty(user.verificationKey)) {
        apiErrorUtils.badRequest(res, "User does not need to be verified");
    } else if (req.body.verificationKey !== user.verificationKey) {
        apiErrorUtils.badRequest(res, "Verification key does not match");
        return;
    } else if (!_.isEmpty(user.verificationKeyExpires) && user.verificationKeyExpires.getTime() > new Date().getTime()) {
        apiErrorUtils.badRequest(res, "Verification period expired for this user");
        return;
    }
    const fieldsToUpdate = {
        verificationKey: null,
        verificationKeyExpires: null,
        lockedReason: null
    }
    await User.findByIdAndUpdate(user._id, fieldsToUpdate).then(user => {
            loggingUtils.createUserLog(req, user.id, `User @${user.username} has been verified`);
            res.status(200).json({message: `User @${user.username} has been verified`});
        })
        .catch(error => {
            apiErrorUtils.internalServerError(req, res, error);
        });
};

const getCurrentUser = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
    }
    const fieldsToOmit = {
        password: 0,
        verificationKey: 0,
        verificationKeyExpires: 0,
        recoveryToken: 0,
        recoveryTokenExpires: 0
    }
    
    User.findById(new mongoose.Types.ObjectId(req.session.userId), fieldsToOmit)
        .then(user => {
            res.status(200).json({
               message: "Profile fetched successfully",
               user: user
            });
        })
        .catch(error => apiErrorUtils.internalServerError(req, res, error));
}

const deleteCurrentUser = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    if (_.isEmpty(user)) {
        apiErrorUtils.badRequest("No user found");
        return;
    }
    if (!authUtils.compare(req.body.password, user.password)) {
        apiErrorUtils.badRequest("Incorrect password to delete user");
        return;
    }
    await User.deleteOne({_id: user.id})
        .then(result => {
            loggingUtils.createUserLog(req, user.id, `User @${user.username} has deleted their account`);
            req.session.destroy();
            res.status(204).send();
        })
        .catch(error => apiErrorUtils.internalServerError(req, res, error));
};

const changePassword = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId));
    if (!user) {
        apiErrorUtils.badRequest(`No user with id ${req.session.userId}`);
    } else if (!authUtils.compare(req.body.oldPassword, user.password)) {
        apiErrorUtils.badRequest("Incorrect old password");
    } else if (!req.body.newPassword) {
        apiErrorUtils.badRequest("New password not provided");
    }
    
    User.findByIdAndUpdate(user._id, {password: authUtils.encrypt(req.body.newPassword)}).then(updatedUser => {
            loggingUtils.createUserLog(req, user.id, `User @${user.username} has changed their password`);
            res.status(200).json({message: `User @${updatedUser.username}'s password has been changed`});
        })
        .catch(error => apiErrorUtils.internalServerError(req, res, error));
};

exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.getCurrentUser = getCurrentUser;
exports.deleteCurrentUser = deleteCurrentUser;
exports.changePassword = changePassword;

// todo: reset one's own password, must provide recorded email address and the proper reset link