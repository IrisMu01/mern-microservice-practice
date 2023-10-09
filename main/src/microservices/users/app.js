const express = require('express');
const router = express.Router();
const appStarter = require('../../appStarter');
const userService = require('./userService');

router.post('/register', userService.registerUser);

router.put('/verify', userService.verifyUser);

router.get('/my-profile', userService.getCurrentUser);

router.delete('/:id', userService.deleteUser);

router.put("/:id/change-password", userService.changePassword);

appStarter.launch({
    name: "UserService",
    port: 4001,
    requestMapping: "/api/users",
    router: router
});