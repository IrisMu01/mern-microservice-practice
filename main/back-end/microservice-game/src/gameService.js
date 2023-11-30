const _ = require("lodash");
const User = require("../../common/src/db-models/User");
const Game = require("../../common/src/db-models/Game");
const mongoose = require("mongoose");
const loggingUtils = require("../../common/src/utils/loggingUtils");
const apiErrorUtils = require("../../common/src/utils/apiErrorUtils");

// todo in the future, consider adding X-save-files-per-user limit
const saveGame = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
        return;
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    const sourceGame = _.cloneDeep(req.body);
    if (!sourceGame.gameState) {
        apiErrorUtils.badRequest(res, "No game state provided");
        return;
    }
    sourceGame.created = new Date();
    sourceGame.user = user._id;
    
    Game.create(sourceGame)
        .then(game => {
            loggingUtils.createUserLog(req, user._id, `User @$${user.username} has created a game save file`);
            res.json({
                message: `User @${user.username}'s game file saved successfully`,
                game: game
            });
        })
        .catch(error => {
            apiErrorUtils.internalServerError(req, res, error);
        });
};

/**
 * @return a list of game IDs and their created dates
 * */
const findAllForCurrentUser = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
        return;
    }
    
    const findQuery = {
        user: new mongoose.Types.ObjectId(req.session.userId)
    };
    const sortQuery = "-created";
    
    Game.find(findQuery, "created user").sort(sortQuery).exec()
        .then(games => {
            res.json({
                query: req.query,
                results: _.map(games, game => game._id),
                gameSaves: _.keyBy(games, "_id")
            });
        })
        .catch(error => {
            apiErrorUtils.internalServerError(req, res, error);
        })
};

const loadGame = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
        return;
    } else if (!req.params.id) {
        apiErrorUtils.badRequest(res, "No game save ID provided");
        return;
    }
    
    const game = await Game.findById(new mongoose.Types.ObjectId(req.params.id)).then(game => game);
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    if (game.user.toString() !== user._id.toString()) {
        apiErrorUtils.badRequest("You cannot access someone else's game file");
        return;
    }
    
    loggingUtils.createUserLog(req, user._id, `User @${user.username} loaded their game file created on ${game.created}`);
    res.json({
        message: `User @${user.username}'s game file loaded successfully`,
        game: game
    });
};

const deleteGame = async (req, res) => {
    const gameId = req.params.id;
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
        return;
    } else if (!gameId) {
        apiErrorUtils.badRequest(res, "No game save ID provided for deletion");
        return;
    }
    
    const game = await Game.findById(new mongoose.Types.ObjectId(gameId)).then(game => game);
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    if (_.isEmpty(game)) {
        loggingUtils.createUserLog(req, user._id, `User@${user.username} attempted to delete non-existent game file with id ${gameId}`);
        res.status(204).send();
        return;
    }
    
    if (game.user.toString() !== user._id.toString()) {
        apiErrorUtils.badRequest(res, "You cannot delete someone else's game file");
        return;
    }
    
    await Game.deleteOne({_id: game._id})
        .then(result => {
            loggingUtils.createUserLog(req, user._id, `User @${user.username} has deleted their game file created on ${game.created}`);
            res.status(204).send();
        })
        .catch(error => apiErrorUtils.internalServerError(req, res, error));
};

exports.saveGame = saveGame;
exports.findAllForCurrentUser = findAllForCurrentUser;
exports.loadGame = loadGame;
exports.deleteGame = deleteGame;
