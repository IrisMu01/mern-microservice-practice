const express = require('express');
const router = express.Router();
const appStarter = require('../../appStarter');
const userService = require('./userService');

// todo: add to logService queue
router.post('/register', userService.registerUser);

// todo: add to logService queue
router.put('/verify', userService.verifyUser);

router.get('/my-profile', userService.getCurrentUser);

// todo: add to logService queue
router.delete('/:id', userService.deleteUser);

// todo: add to logService queue
router.put("/:id/change-password", userService.changePassword);

appStarter.launch({
    name: "UserService",
    port: 4001,
    requestMapping: "/api/users",
    router: router
});