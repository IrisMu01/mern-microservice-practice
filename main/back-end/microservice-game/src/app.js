const express = require('express');
const router = express.Router();
const appStarter = require('../../common/src/utils/appStarter');
const gameService = require('./gameService');

router.get("/ping", (req, res) => {
    res.status(200).send();
});

router.post('/save', gameService.saveGame);

router.get('/all', gameService.findAllForCurrentUser);

router.get('/:id/load', gameService.loadGame);

router.delete('/:id', gameService.deleteGame);

appStarter.launch({
    name: "GameService",
    port: 4003,
    requestMapping: "/api/game",
    router: router
});
