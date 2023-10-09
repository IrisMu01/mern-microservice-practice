/*
* create user activity entry
* create error entry
* query entries based on time ranges and user
* (later - create: cron job entries)
* (later - query: pagination, more filters)
* (later with cronJobService: clear logs >30 days old)
* */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const logService = require('./logService');

mongoose.set("returnOriginal", false);
mongoose.set("debug", true);

router.post('/create', logService.create);

router.get('/search', logService.search);

module.exports = router;