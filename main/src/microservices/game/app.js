const express = require('express');
const router = express.Router();
const appStarter = require('../../common-utils/appStarter');
const gameService = require('./gameService');

router.post('/save', gameService.saveGame);

router.get('/:id/all', gameService.findAllForCurrentUser);

router.get('/:id/load', gameService.loadGame);

router.delete('/:id', gameService.deleteGame);

appStarter.launch({
    name: "GameService",
    port: 4003,
    requestMapping: "/api/game",
    router: router
});
