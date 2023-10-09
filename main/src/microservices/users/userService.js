const _ = require("lodash");
const User = require("../../db-models/User");
const authUtils = require("../auth/authUtils");
const mongoose = require("mongoose");

// todo add support for sending emails containing verification code
// todo before commit: switch out detection of sessions with
const registerUser = async (req, res) => {
    const sourceUser = _.cloneDeep(req.body);
    if (!sourceUser.email) {
        res.status(400).json({message: "No email address provided"});
        return;
    }
    const potentialUser = await User.findOne({username: req.body.username});
    if (!_.isEmpty(potentialUser)) {
        res.status(400).json({message: "A user with this username already exists"});
        return;
    }
    
    sourceUser.password = authUtils.encrypt(sourceUser.password);
    sourceUser.verificationKey = authUtils.generateRandomString(12);
    sourceUser.lockedReason = "Unverified";
    User.create(sourceUser)
        .then(user => {
            res.json({
                id: user._id,
                message: `User @${user.username} registered successfully`,
                verificationKey: user.verificationKey
            });
        })
        .catch(error => res.status(500).json({
            message: "Internal server error - failed to create user",
            error: error
        }));
};

const verifyUser = async (req, res) => {
    if (_.isEmpty(req.body.username)) {
        res.status(400).json({error: "No username provided"});
        return;
    }
    const user = await User.findOne({username: req.body.username}).then(user => user);
    if (_.isEmpty(user)) {
        res.status(400).json({message: "No user found"});
        return;
    } else if (_.isEmpty(user.verificationKey)) {
        res.status(400).json({message: "User does not need to be verified"});
    } else if (req.body.verificationKey !== user.verificationKey) {
        res.status(400).json({message: "Verification key does not match"});
        return;
    } else if (!_.isEmpty(user.verificationKeyExpires) && user.verificationKeyExpires.getTime() > new Date().getTime()) {
        res.status(400).json({message: "Verification period expired for this user"});
        return;
    }
    const fieldsToUpdate = {
        verificationKey: null,
        verificationKeyExpires: null,
        lockedReason: null
    }
    await User.findByIdAndUpdate(user._id, fieldsToUpdate).then(user => {
            res.status(200).json({message: `User @${user.username} has been verified`});
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal server error - failed to delete user",
                error: error
            });
        });
};

const getCurrentUser = async (req, res) => {
    if (!req.session.userId) {
        res.status(403).json({message: "Unauthorized"});
        return;
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
        .catch(error => {
            res.status(500).json({
                message: "Internal server error - failed to fetch current user profile",
                error: error
            });
        })
}

// todo rethink logic
//  now anyone can delete users, and the case of deleting users with active session is not considered
const deleteUser = async (req, res) => {
    if (!req.session.userId) {
        res.status(403).json({message: "Unauthorized"});
        return;
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(req.params.id)).then(user => user);
    if (_.isEmpty(user)) {
        res.status(400).json({message: "No user found"});
        return;
    } else if (!_.isEmpty(user.lockedReason) && user.lockedReason !== "Self-deactivated") {
        res.status(400).json({message: `${user.lockedReason} user cannot be deleted`});
    }
    if (!authUtils.compare(req.body.password, user.password)) {
        res.status(400).json({error: "Incorrect password to delete user"});
        return;
    }
    await User.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id)})
        .then(result => res.status(204).send())
        .catch(error => {
            res.status(500).json({
                message: "Internal server error - failed to delete user",
                error: error
            });
        });
};

const changePassword = async (req, res) => {
    if (!req.session.userId) {
        res.status(403).json({message: "Unauthorized"});
        return;
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId));
    if (!user) {
        res.status(500).json({message: `No user with id ${req.session.userId}`});
        return;
    } else if (!authUtils.compare(req.body.oldPassword, user.password)) {
        res.status(400).json({message: "Incorrect old password"});
    } else if (!req.body.newPassword) {
        res.status(400).json({message: "New password not provided"});
    }
    
    User.findByIdAndUpdate(user._id, {password: authUtils.encrypt(req.body.newPassword)}).then(updatedUser => {
            res.status(200).json({message: `User @${updatedUser.username}'s password has been changed`});
        })
        .catch(error => {
            res.status(500).json({
                message: "Internal server error - failed to change user's password",
                error: error
            });
        });
};

exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.getCurrentUser = getCurrentUser;
exports.deleteUser = deleteUser;
exports.changePassword = changePassword;

// todo: reset one's own password, must provide recorded email address and the proper reset link