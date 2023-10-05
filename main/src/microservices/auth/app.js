const express = require('express');
const router = express.Router();
const appStarter = require('../../appStarter');
const authService = require('./authService');

router.post("/login", authService.login);

router.get("/logout", authService.logout);

router.post('/register', authService.registerUser); // separate into userService

router.put('/verify', authService.verifyUser); // separate into userService

router.delete('/:id', authService.deleteUser); // separate into userService

router.put("/:id/change-password", authService.changePassword); // separate into userService

appStarter.launch({
    name: "AuthService",
    port: 4000,
    manageSessions: true,
    requestMapping: "/api/auth",
    router: router
});