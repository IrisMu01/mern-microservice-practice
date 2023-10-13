const express = require('express');
const router = express.Router();
const appStarter = require('../../common-utils/appStarter');
const logService = require('./logService');

router.get('/search', logService.search);

appStarter.launch({
    name: "LogService",
    port: 4002,
    requestMapping: "/api/logs",
    router: router
});