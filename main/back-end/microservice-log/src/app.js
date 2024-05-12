const express = require('express');
const router = express.Router();
const appStarter = require('../../common/src/utils/appStarter');
const logService = require('./logService');

router.get("/ping", (req, res) => {
    res.status(200).send();
});

router.get('/search', logService.search);

appStarter.launch({
    name: "LogService",
    port: 4002,
    requestMapping: "/api/logs",
    router: router
});
