const _ = require("lodash");
const User = require("../../db-models/User");
const Game = require("../../db-models/Game");
const mongoose = require("mongoose");
const loggingUtils = require("../../common-utils/loggingUtils");
const apiErrorUtils = require("../../common-utils/apiErrorUtils");

// todo in the future, consider adding X-save-files-per-user limit
const saveGame = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
    }
    
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    const sourceGame = _.cloneDeep(req.body);
    if (!sourceGame.gameState) {
        apiErrorUtils.badRequest(res, "No game state provided");
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
    }
    
    const findQuery = {
        user: new mongoose.Types.ObjectId(req.session.userId)
    };
    const sortQuery = "-created";
    
    Game.find(findQuery, "created user").sort(sortQuery).exec()
        .then(games => {
            res.json({
                query: req.query,
                results: games
            });
        })
        .catch(error => {
            apiErrorUtils.internalServerError(req, res, error);
        })
};

const loadGame = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
    } else if (!req.gameId) {
        apiErrorUtils.badRequest(res, "No game save ID provided");
    }
    
    const game = await Game.findById(new mongoose.Types.ObjectId(req.gameId)).then(game => game);
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    if (game.user !== user._id) {
        apiErrorUtils.badRequest("You cannot access someone else's game file");
    }
    
    loggingUtils.createUserLog(req, user._id, `User @${user.username} loaded their game file created on ${game.created}`);
    res.json({
        message: `User @${user.username}'s game file loaded successfully`,
        game: game
    });
};

const deleteGame = async (req, res) => {
    if (!req.session.userId) {
        apiErrorUtils.unauthorized(res);
    } else if (!req.gameId) {
        apiErrorUtils.badRequest(res, "No game save ID provided for deletion");
    }
    
    const game = await Game.findById(new mongoose.Types.ObjectId(req.gameId)).then(game => game);
    const user = await User.findById(new mongoose.Types.ObjectId(req.session.userId)).then(user => user);
    if (game.user !== user._id) {
        apiErrorUtils.badRequest("You cannot delete someone else's game file");
    }
    
    await Game.deleteOne({_id: game._id})
        .then(result => {
            loggingUtils.createUserLog(req, user._id, `User @${user.username} has deleted their game file created on ${game.created}`);
            req.status(204).send();
        })
        .catch(error => apiErrorUtils.internalServerError(req, res, error));
};

exports.saveGame = saveGame;
exports.findAllForCurrentUser = findAllForCurrentUser;
exports.loadGame = loadGame;
exports.deleteGame = deleteGame;
