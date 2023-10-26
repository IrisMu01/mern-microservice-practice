import {createSlice} from "@reduxjs/toolkit";
import {humanActionTypes, dogActionTypes} from "../../utils/constants";
import {timeControl} from "./reducers/timeControl";
import {movements} from "./reducers/movements";
import {humanActions, dogActions} from "./reducers/interactions";
import {availableActions} from "./reducers/availableActions";
import {losingConditions} from "./reducers/losingConditions";
import _ from "lodash";

// the largest index number within the matrix rows and columns.
const mapDimension = {
    x: 5,
    y: 5
};

const mockMap = [
    ["cg", "cb", "cg", "cg", "wa", "gr"],
    ["cg", "tr", "tr", "gr", "wa", "gr"],
    ["cg", "gr", "fa", "fa", "wa", "wa"],
    ["tr", "gr", "se", "ho", "bo", "wa"],
    ["ct", "bt", "wa", "wa", "wa", "wi"],
    ["wa", "wa", "wd", "wa", "cg", "pa"]
];

const plantEnergyMap = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];

const unknowns = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1]
];

const humanAvailableActions = {};
_.forEach(humanActionTypes, (value, key) => {
    humanAvailableActions[value] = false;
});
const dogAvailableActions = {};
_.forEach(dogActionTypes, (value, key) => {
    dogAvailableActions[value] = false;
});

const initialTerrain = {
    dimension: mapDimension,
    map: mockMap,
    fogMap: unknowns,
    plantEnergyMap: plantEnergyMap
};

const initialPlayer = {
    humanCoordinate: {x: 3, y: 3},
    dogCoordinate: {x: 5, y: 4},
    round: 1, // 6 rounds per day
    trueRound: 1, // only increments
    switchedToHuman: true,
    humanStatus: {
        hunger: 80,
        sanity: 60,
        actionPoints: 3, // variable by hunger
        restPoints: 0,
        workPoints: 0,
        onBoat: false
    },
    dogStatus: {
        alive: true,
        onTeam: false,
        hunger: 10,
        actionPoints: 2, // variable by hunger
    },
    inventory: {
        seed: 2,
        sapling: 2,
        wood: 0,
        fish: 0,
        crop: 0,
        food: 1
    },
};

const initialHistory = {
    reverseCount: 0,
    coordinates: [
        {
            human: null,
            dog: null
        },
        {
            human: null,
            dog: null
        },
        {
            human: null,
            dog: null
        }
    ]
};

const initialAvailableActions = {
    human: humanAvailableActions,
    dog: dogAvailableActions
};

export const gameSlice = createSlice({
    name: "currentTerrain",
    initialState: {
        gameStatus: null, // true - winning | false - losing | null - in progress
        terrain: initialTerrain,
        player: initialPlayer,
        history: initialHistory,
        availableActions: initialAvailableActions
    },
    reducers: {
        resetGame: (state, action) => {
            state.gameStatus = null;
            state.terrain = initialTerrain;
            state.player = initialPlayer;
            state.history = initialHistory;
            state.availableActions = initialAvailableActions;
        },
        determineAvailableActions: (state, action) => {
            availableActions.determineForHuman(state);
            availableActions.determineForDog(state);
        },
        forwardTime: (state, action) => {
            const lifeNum = action.payload.lifeNum, deathNum = action.payload.deathNum;
            timeControl.forwardTime(state, lifeNum, deathNum);
            availableActions.determineForHuman(state);
            availableActions.determineForDog(state);
            losingConditions.check(state);
        },
        reverseTime: (state, action) => {
            const lifeNum = action.payload.lifeNum;
            timeControl.reverseTime(state, lifeNum);
            availableActions.determineForHuman(state);
            availableActions.determineForDog(state);
            losingConditions.check(state)
        },
        switchBetweenHumanAndDog: (state, action) => {
            movements.switchBetweenHumanAndDog(state, action);
        },
        moveHuman: (state, action) => {
            movements.moveHuman(state, action.payload);
            availableActions.determineForHuman(state);
        },
        moveDog: (state, action) => {
            movements.moveDog(state, action.payload);
            availableActions.determineForDog(state);
        },
        humanAction: (state, action) => {
            const actionType = action.payload.actionType;
            const luckNumber = action.payload.luckNumber;
            switch (actionType) {
                case humanActionTypes.explore:
                    humanActions.explore(state);
                    break;
                case humanActionTypes.feedDog:
                    humanActions.feedDog(state);
                    break;
                case humanActionTypes.buildBoat:
                    humanActions.buildBoat(state);
                    break;
                case humanActionTypes.fish:
                    humanActions.fish(state, luckNumber);
                    break;
                case humanActionTypes.startFarm:
                    humanActions.startFarm(state);
                    break;
                case humanActionTypes.plantTree:
                    humanActions.plantTree(state);
                    break;
                case humanActionTypes.harvest:
                    humanActions.harvest(state, luckNumber);
                    break;
                case humanActionTypes.releaseTreeEnergy:
                    humanActions.releaseTreeEnergy(state, luckNumber);
                    break;
                case humanActionTypes.makeFood:
                    humanActions.makeFood(state);
                    break;
                case humanActionTypes.eat:
                    humanActions.eat(state);
                    break;
                case humanActionTypes.rest:
                    humanActions.rest(state);
                    break;
                case humanActionTypes.cleanWilt:
                    humanActions.cleanWilt(state);
                    break;
                default:
                    console.warn("Invalid human action type: " + actionType);
            }
            losingConditions.check(state);
        },
        dogAction: (state, action) => {
            const actionType = action.payload.actionType;
            switch (actionType) {
                case dogActionTypes.explore:
                    dogActions.explore(state);
                    break;
                case dogActionTypes.cleanWilt:
                    dogActions.cleanWilt(state);
                    break;
                default:
                    console.warn("Invalid dog action type: " + actionType);
            }
        }
    }
});

export const {
    resetGame,
    determineAvailableActions,
    forwardTime,
    reverseTime,
    switchBetweenHumanAndDog,
    moveHuman,
    moveDog,
    humanAction,
    dogAction
} = gameSlice.actions;

export default gameSlice.reducer;
