/*
* create user, must be distinct username (later: configure smtp to send verification emails)
* verify user, must provide username and verification key
* login (can't log in with non-active or incorrect password)
* change one's own password, must provide old password
* (later: reset one's own password, must provide recorded email address and the proper reset link)
* delete one's account, but it's not a true delete
* */
const express = require('express');
const router = express.Router();
const passwordUtils = require('./passwordUtils');
const _ = require('lodash');

const User = require('../models/User');

router.post('/register', (req, res) => {
  const sourceUser = _.cloneDeep(req.body);
  sourceUser.password = passwordUtils.encrypt(sourceUser.password);
  res.status(400).json({error: "no"});
});

module.exports = router;