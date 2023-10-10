const express = require('express');
const router = express.Router();
const appStarter = require('../../appStarter');
const authService = require('./authService');

// todo: add to logService queue
router.post("/login", authService.login);

// todo: add to logService queue
router.get("/logout", authService.logout);

appStarter.launch({
    name: "AuthService",
    port: 4000,
    requestMapping: "/api/auth",
    router: router
});