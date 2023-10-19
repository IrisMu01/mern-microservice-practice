import { createSlice } from "@reduxjs/toolkit";
import { mapValue, humanAction, dogAction } from "../../utils/constants";
import { getSurroundingCells, getDirectSurroundingCells } from "../../utils/utils";
import { forwardTime } from "./reducers/forwardTime";
import { reverseTime } from "./reducers/reverseTime";
import { switchBetweenHumanAndDog, movePlayer, moveDog } from "./reducers/movements";
import { explore, interactWithWater, interactWithGrass, interactWithCrop, interactWithHouse, interactWithTree, interactWithWilt, interactWithDog } from "./reducers/interactions";
import { determineHumanActions, determineDogActions } from "./reducers/determineAvailableActions";
import _ from "lodash";

const environmentSanityBonus = {};
environmentSanityBonus[mapValue.cursedGrass] = -3;
environmentSanityBonus[mapValue.babyTree] = 1;
environmentSanityBonus[mapValue.tree] = 3;
environmentSanityBonus[mapValue.wilt] = -2;

// the largest index number within the matrix rows and columns.
const mapDimension = {
    x: 5,
    y: 5
};

const mockMap = [
    ["cg", "cg", "cg", "cg", "ri", "gr"],
    ["cg", "tr", "tr", "gr", "ri", "gr"],
    ["cg", "gr", "fa", "fa", "ri", "ri"],
    ["tr", "gr", "se", "ho", "bo", "ri"],
    ["cg", "bt", "gr", "ri", "ri", "wi"],
    ["ri", "cg", "ri", "ri", "cg", "pa"]
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
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0]
];

const humanAvailableActions = {};
_.forEach(humanAction, (value, key) => {
    humanAvailableActions[value] = false;
});
const dogAvailableActions = {};
_.forEach(dogAction, (value, key) => {
    dogAvailableActions[value] = false;
});

export const gameSlice = createSlice({
    name: "currentTerrain",
    initialState: {
        terrain: {
            dimension: mapDimension,
            map: mockMap,
            fogMap: unknowns,
            plantEnergyMap: plantEnergyMap
        },
        player: {
            humanCoordinate: {x: 3, y: 3},
            dogCoordinate: {x: 5, y: 0},
            round: 1, // 6 rounds per day
            trueRound: 1, // only increments
            switchedToHuman: true,
            humanStatus: {
                hunger: 80,
                sanity: 60,
                actionPoints: 5, // will be variable by hunger/sanity in the future
                onBoat: false,
                resting: false
            },
            dogStatus: {
                alive: true,
                onTeam: false,
                hunger: 10,
                actionPoints: 3, // will be variable by hunger in the future
                onBoat: false
            },
            inventory: {
                seed: 4,
                sapling: 10,
                wood: 0,
                fish: 0,
                crop: 0,
                food: 0
            },
        },
        history: {
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
        },
        availableActions: {
            human: humanAvailableActions,
            dog: dogAvailableActions
        }
    },
    reducers: {
        // todo separate failing condition checks out of each function
        forwardTime: (state, action) => {
            forwardTime(state, action);
            determineHumanActions(state);
            determineDogActions(state);
        },
        reverseTime: (state, action) => {
            reverseTime(state, action);
            determineHumanActions(state);
            determineDogActions(state);
        },
        switchBetweenHumanAndDog: (state, action) => {
            switchBetweenHumanAndDog(state, action);
        },
        movePlayer: (state, action) => {
            movePlayer(state, action);
            determineHumanActions(state);
        },
        moveDog: (state, action) => {
            moveDog(state, action);
            determineDogActions(state);
        },
        explore: (state, action) => {
            explore(state, action);
            determineHumanActions(state);
            determineDogActions(state);
        },
        dogExplore: (state, action) => {
            // todo dog explore
            determineHumanActions(state);
            determineDogActions(state);
        },
        interactWithWater: interactWithWater,
        interactWithGrass: interactWithGrass,
        interactWithCrop: interactWithCrop,
        interactWithHouse: interactWithHouse,
        interactWithTree: interactWithTree,
        interactWithWilt: interactWithWilt,
        interactWithDog: interactWithDog
    }
});

export const {
    forwardTime, reverseTime, switchBetweenHumanAndDog, movePlayer, moveDog, explore,
    interactWithWater, interactWithGrass, interactWithCrop, interactWithHouse,
    interactWithTree, interactWithWilt, interactWithDog
} = gameSlice.actions;

export default gameSlice.reducer;