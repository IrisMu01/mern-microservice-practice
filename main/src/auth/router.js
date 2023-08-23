/*
* login (can't log in with non-active or incorrect password)
* change one's own password, must provide old password
* (later: reset one's own password, must provide recorded email address and the proper reset link)
* */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const authUtils = require('./authUtils');
const _ = require('lodash');

mongoose.set("returnOriginal", false);

// todo add support for sending emails containing verification code
router.post('/register', (req, res) => {
    const sourceUser = _.cloneDeep(req.body);
    if (!sourceUser.email) {
        res.status(400).json({message: "No email address provided"});
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
});

router.put('/verify', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
    const user = await User.findById(new mongoose.Types.ObjectId(req.params.id)).then(user => user);
    if (_.isEmpty(user)) {
        res.status(400).json({message: "No user found"});
        return;
    } else if (!_.isEmpty(user.lockedReason) && user.lockedReason !== "Self-deactivated") {
        res.status(400).json({message: `${user.lockedReason} user cannot be deleted`});
    }
    if (!authUtils.compare(req.body.password, user.password)) {
        res.status(400).json({error: "Incorrect credentials"});
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
});

module.exports = router;