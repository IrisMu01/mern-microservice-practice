const express = require('express');
const router = express.Router();
const appStarter = require('../../../common/src/utils/appStarter');
const userService = require('./userService');

router.post('/register', userService.registerUser);

router.put('/verify', userService.verifyUser);

router.get('/my-profile', userService.getCurrentUser);

router.put('/delete-my-account', userService.deleteCurrentUser);

router.put("/change-password", userService.changePassword);

appStarter.launch({
    name: "UserService",
    port: 4001,
    requestMapping: "/api/users",
    router: router
});
