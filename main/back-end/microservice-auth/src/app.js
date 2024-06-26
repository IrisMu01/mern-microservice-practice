const express = require('express');
const router = express.Router();
const appStarter = require('../../common/src/utils/appStarter');
const authService = require('./authService');

router.get("/ping", (req, res) => {
    res.status(200).send();
});

router.post("/login", authService.login);

router.get("/logout", authService.logout);

appStarter.launch({
    name: "AuthService",
    port: 4000,
    requestMapping: "/api/auth",
    router: router
});
