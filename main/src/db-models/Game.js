const mongoose = require('mongoose');

const gameSaveSchema = new mongoose.Schema({
        created: {
            type: Date,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        gameState: {
            type: Object,
            required: true
        }
    }
);

module.exports = GameSave = mongoose.model('gameSave', gameSaveSchema);
