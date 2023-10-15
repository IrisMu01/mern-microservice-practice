import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const mapValue = {
    boat: "bo",
    babyTree: "bt",
    cursedGrass: "cg",
    farm: "fa",
    grass: "gr",
    house: "ho",
    paw: "pa",
    river: "ri",
    seedling: "se",
    tree: "tr",
    wilt: "wi"
};

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

const getSurroundingCells = (state, x, y) => {
    if (x > mapDimension.x || y > mapDimension.y) {
        return [];
    }
    const cells = [];
    for (let i = x-1; i < Math.min(x+1, mapDimension.x); i++) {
        for (let j = y-1; j < Math.min(y+1, mapDimension.y); j++) {
            if (i !== x || j !== y) {
                cells.push({
                    x: i,
                    y: j,
                    mapValue: state.terrain.map[i][j]
                });
            }
        }
    }
    return cells;
};

const getCurrentCell = (state, x, y) => {
    if (x > mapDimension.x || y > mapDimension.y) {
        return null;
    } else {
        return state.terrain.map[x][y];
    }
};

const isHumanOnUnexploredCell = (state) => {
    return state.map.fogMap[state.player.humanCoordinate.x][state.player.humanCoordinate.y];
}

const mockMap = [
    ["cg", "cg", "cg", "cg", "ri", "dg"],
    ["cg", "tr", "tr", "gr", "ri", "gr"],
    ["cg", "gr", "fa", "fa", "ri", "ri"],
    ["tr", "gr", "se", "ho", "ri", "ri"],
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

export const gameSlice = createSlice({
    name: "currentTerrain",
    initialState: {
        terrain: {
            map: mockMap,
            fogMap: unknowns,
            plantEnergyMap: plantEnergyMap
        },
        player: {
            humanCoordinate: {x: 3, y: 3},
            dogCoordinate: {x: 0, y: 5},
            round: 1, // 6 rounds per day
            trueRound: 1, // only increments
            humanStatus: {
                hunger: 100,
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
        }
    },
    reducers: {
        // todo separate failing condition checks out of each function
        forwardTime: (state, action) => {
            
            // ============ human & dog status changes =============
            
            // change human hunger: drop by 15 to a minimum of 0
            state.player.humanStatus.hunger = Math.max(0, state.player.humanStatus.hunger - 15);
    
            // change dog hunger: drop by 10; dog dies if its hunger drops to -30
            let dogDeathThisRound = false;
            state.player.dogStatus.hunger = Math.max(-30, state.player.dogStatus.hunger - 10);
            if (state.player.dogStatus.hunger < -30 && state.player.dogStatus.alive) {
                state.player.dogStatus.alive = false;
                dogDeathThisRound = true;
            }
            
            // change sanity based on:
            // - new hunger
            // - dog presence (dog death)
            // - surrounding environment
            // - at rest during night (round % 6 === 4 || round % 6 === 5)
            let sanityChange = 0;
            if (state.player.humanStatus.hunger < 30) {
                sanityChange -= 15;
            }
            if (dogDeathThisRound) {
                sanityChange -= 40;
            } else if (state.player.dogStatus.alive) {
                sanityChange += 15;
            }
            const neighbourCells = getSurroundingCells(state, state.player.humanCoordinate.x, state.player.humanCoordinate.y);
            _.forEach(neighbourCells, cell => {
                sanityChange += environmentSanityBonus[cell.mapValue] || 0;
            });
            if (state.player.round % 6 === 5 || state.play.round % 6 === 4) {
                if (mapValue.house === getCurrentCell(state, state.player.humanCoordinate.x, state.player.humanCoordinate.y) 
                    && state.player.humanStatus.resting) {
                    sanityChange += 10;
                } else {
                    sanityChange -= 25;
                }
            }
            
            // determine next round's available action amount for human & dog: should be variable in the future
            state.player.humanStatus.actionPoints = 7;
            state.player.dogStatus.actionPoints = 5;
            
            // ============= history =============
            
            // add current coordinates to history; only take the first 3 elements in the coordinates list
            state.history.coordinates = [{
                human: state.player.humanCoordinate,
                dog: state.player.humanCoordinate
            }, ...state.history.coordinates].slice(0, 3);
            
            // ============ do map scan ============
    
            // declare variable lifeNum, deathNum from action.payload;
            // these 2 are randomly generated numbers between 0 and 100
            const lifeNum = action.payload.lifeNum, deathNum = action.payload.deathNum;
            let noCursedGrassOrWilt = true;
            
            for (let i = 0; i < mapDimension.x; i++) {
                for (let j = 0; j < mapDimension.y; j++) {
                    
                    // boolean tracker for determining winning conditions
                    if (mapValue.cursedGrass === state.map.terrain[i][j] || mapValue.wilt === state.map.terrain[i][j]) {
                        noCursedGrassOrWilt = false;
                    }
                    
                    // baby tree: if lifeNum < plantEnergy, grow; else +min(50, lifeNum) to plantEnergy
                    if (mapValue.babyTree === state.map.terrain[i][j])
                    if (lifeNum < state.map.plantEnergyMap[i][j]) {
                        state.map.terrain[i][j] = mapValue.tree;
                        state.map.plantEnergyMap[i][j] = 100;
                    } else {
                        state.map.plantEnergyMap[i][j] += Math.min(50, lifeNum);
                    }
    
                    // tree: if deathNum > plantEnergy, wilt; else -max(33, deathNum) to plantEnergy
                    if (mapValue.tree === state.map.terrain[i][j]) {
                        if (deathNum > state.map.plantEnergyMap[i][j]) {
                            state.map.terrain[i][j] = mapValue.wilt;
                        } else {
                            state.map.plantEnergyMap[i][j] -= Math.max(33, deathNum);
                        }
                    }
    
                    // wilt: if deathNum > 49, spread to a neighbouring cell
                    // if spread:
                    //      wilt becomes cursed grass
                    //      if neighbouring cell has tree/sapling, cell becomes wilt; otherwise cell becomes cursed grassland
                    if (mapValue.wilt === state.map.terrain[i][j]) {
                        if (deathNum > 49) {
                            state.map.terrain[i][j] = mapValue.cursedGrass;
                            const wiltSpread = _.floor(deathNum / 12.5);
                            const affectedCells = getSurroundingCells(state, i, j).slice(0, wiltSpread);
                            _.forEach(affectedCells, affectedCell => {
                                if (mapValue.babyTree === affectedCell.mapValue || mapValue.tree === affectedCell.mapValue) {
                                    state.map.terrain[affectedCell.x][affectedCell.y] = mapValue.wilt;
                                } else {
                                    state.map.terrain[affectedCell.x][affectedCell.y] = mapValue.cursedGrass;
                                }
                            });
                        }
                    }
    
                    // crop seedling: if lifeNum < plantEnergy, mature; else + min(50, lifeNum) to plantEnergy
                    if (mapValue.seedling === state.map.terrain[i][j]) {
                        if (lifeNum < state.map.plantEnergyMap[i][j]) {
                            state.map.terrain[i][j] = mapValue.farm;
                        } else {
                            state.map.plantEnergyMap[i][j] += Math.min(50, lifeNum);
                        }
                    }
                }
            }
            
            // ============= map scan completes ==============
            
            // increment round and true round
            state.player.round += 1;
            state.player.trueRound += 1;
            
            // reset reverse count to 1
            state.history.reverseCount -= 1;
            
            // check failing conditions: sanity <= 0 || time limit reached (in the future)
            if (state.player.humanStatus.sanity <= 0) {
                console.error("Failing conditions met");
            }
            
            // check success conditions: no cursed grass/wilt
            if (noCursedGrassOrWilt) {
                console.log("Winning conditions met");
            }
        },
        reverseTime: (state, action) => {
            
            // cannot reverse time if trueRound < 2 || round < 2
            if (state.player.round < 2 || state.player.trueRound < 2) {
                return;
            }
            
            // ============= status changes ===============
            
            // set human & dog coordinates based on 1st entry
            state.player.humanCoordinate = state.history.coordinates[0].human;
            state.player.dogCoordinate = state.history.coordinates[0].dog;
            
            // reduce human sanity based on 25 * reverse count
            state.player.humanStatus.sanity -= 25 * state.history.reverseCount;
            
            // ============= do map scan ===============
    
            // declare variable lifeNum, a random number between 50 and 100
            const lifeNum = action.payload.lifeNum, deathNum = action.payload.deathNum;
            
            for (let i = 0; i < mapDimension.x; i++) {
                for (let j = 0; j < mapDimension.y; j++) {
                    // wilt: becomes tree; cell plantEnergy gets assigned lifeNum
                    if (mapValue.wilt === state.map.terrain[i][j]) {
                        state.map.terrain[i][j] = mapValue.tree;
                        state.map.plantEnergyMap[i][j] = lifeNum;
                    }
    
                    // farm: if plantEnergy < lifeNum, revert to seedling
                    if (mapValue.farm === state.map.terrain[i][j]) {
                        if (state.map.plantEnergyMap[i][j] < lifeNum) {
                            state.map.terrain[i][j] = mapValue.seedling;
                        }
                    }
                }
            }
            
            // ============= complete map scan ================
            
            // decrement round, increment true round, increment reverse count
            state.player.round -= 1;
            state.player.trueRound += 1;
            state.history.reverseCount += 1;
            
            // check failing conditions: sanity <= 0
            if (state.player.humanStatus.sanity <= 0) {
                console.error("Failing conditions met");
            }
        },
        movePlayer: (state, action) => {
            // declare variable based on action.payload
            const direction = action.payload;
            const startingCoordinate = _.cloneDeep(state.player.humanCoordinate);
            const targetCoordinate = {x: startingCoordinate.x, y: startingCoordinate.y};
            switch (direction) {
                case "w":
                    targetCoordinate.y = Math.max(mapDimension.y, targetCoordinate.y + 1);
                    break;
                case "a":
                    targetCoordinate.x = Math.max(0, targetCoordinate.x - 1);
                    break;
                case "s":
                    targetCoordinate.y = Math.max(0, targetCoordinate.y - 1);
                    break;
                case "d":
                    targetCoordinate.x = Math.max(mapDimension.x, targetCoordinate.x + 1);
                    break;
            }
            const targetCell = state.map.terrain[targetCoordinate.x][targetCoordinate.y];
            
            const targetIsWater = mapValue.river === targetCell || mapValue.boat === targetCell;
            if (state.player.humanStatus.onBoat && !targetIsWater) {
                // if onBoat, and walking onto land: set onBoat to false
                state.player.humanStatus.onBoat = false;
            } else if (state.player.humanStatus.onBoat && targetIsWater) {
                // if onBoat, and walking into water: change player/boat/dog coordinate, swap map boat/water cells
                const tempCell = _.clone(targetCell);
                state.map.terrain[targetCoordinate.x][targetCoordinate.y] = state.map.terrain[startingCoordinate.x][startingCoordinate.y];
                state.map.terrain[startingCoordinate.x][startingCoordinate.y] = tempCell;
            } else if (!state.player.humanStatus.onBoat && targetIsWater) {
                // if not onBoat, cannot walk into water
                return;
            }
    
            // change player coordinate based on w-a-s-d
            state.player.humanCoordinate = targetCoordinate;
            
            // if human on the same boat with dog, change dog coordinate based on player coordinate
            if (state.player.dogCoordinate.x === startingCoordinate.x && state.player.dogCoordinate.y === startingCoordinate.y) {
                state.player.dogCoordinate = targetCoordinate;
            }
            
            // if map coordinate points to boat: set onBoat to true
            if (!state.player.humanStatus.onBoat && mapValue.boat === targetCell) {
                state.player.humanStatus.onBoat = true;
            }
        },
        moveDog: (state, action) => {
            // declare variable based on action.payload
            const direction = action.payload;
            const startingCoordinate = _.cloneDeep(state.player.dogCoordinate);
            const targetCoordinate = {x: startingCoordinate.x, y: startingCoordinate.y};
            switch (direction) {
                case "w":
                    targetCoordinate.y = Math.max(mapDimension.y, targetCoordinate.y + 1);
                    break;
                case "a":
                    targetCoordinate.x = Math.max(0, targetCoordinate.x - 1);
                    break;
                case "s":
                    targetCoordinate.y = Math.max(0, targetCoordinate.y - 1);
                    break;
                case "d":
                    targetCoordinate.x = Math.max(mapDimension.x, targetCoordinate.x + 1);
                    break;
            }
            const targetCell = state.map.terrain[targetCoordinate.x][targetCoordinate.y];
    
            if (state.player.dogStatus.onBoat && mapValue.river === targetCell) {
                // cannot move if onBoat - human boat movement already updates dog coordinate
                return;
            } else if (state.player.dogStatus.onBoat && mapValue.river !== targetCell && mapValue.boat !== targetCell) {
                // if onBoat and walking onto adjacent land, then set onBoat to false
                state.player.dogStatus.onBoat = false;
            } else if (!state.player.dogStatus.onBoat && mapValue.river === targetCell) {
                // if not onBoat, cannot walk into river
                return;
            } else if (!state.player.dogStatus.onBoat && mapValue.boat === targetCell) {
                // if map coordinate points to boat: set onBoat to true
                state.player.dogStatus.onBoat = true;
            }
    
            // change dog coordinate based on w-a-s-d
            state.player.dogCoordinate = targetCoordinate;
        },
        explore: (state, action) => {
            const surroundingCells = getSurroundingCells(state, state.player.humanCoordinate.x, state.player.humanCoordinate.y);
            const unknownSurroundingCellExists = _.chain(surroundingCells)
                .map(cell => state.map.fogMap[cell.x][cell.y])
                .reduce((acc, unknown) => acc || unknown, false)
                .value();
            if (!unknownSurroundingCellExists) {
                // cannot explore if surrounding cells all explored
                return;
            }
            
            // set surrounding cells unknown to false
            _.forEach(surroundingCells, cell => {
                state.map.fogMap[cell.x][cell.y] = false;
            });
            
            // if on cursed grass, human sanity -10
            if (mapValue.cursedGrass === getCurrentCell(state, state.player.humanCoordinate.x, state.player.humanCoordinate.y)) {
                state.player.humanStatus.sanity -= 10;
            }
        },
        interactWithWater: (state, action) => {
            // cannot interact if unexplored or no action points
            if (isHumanOnUnexploredCell(state) || state.player.humanStatus.actionPoints < 1) {
                return;
            }
            
            // get action type and water coordinate from action.payload
            const actionType = action.payload.actionType;
            const waterCoordinate = action.payload.waterCoordinate;
            const fishingLuck = action.payload.fishingLuck; // random integer between 0 and 100
            
            if (actionType === "fish") {
                // fish: 70% 1 fish, 25% 2 fish, 5% garbage
                if (fishingLuck >= 75) {
                    state.player.inventory.fish += 2;
                } else if (fishingLuck >= 5) {
                    state.player.inventory.fish += 1;
                }
            } else if (actionType === "boat") {
                if (state.inventory.wood >= 5) {
                    // buildBoat: if inventory wood >= 5, water coordinate becomes boat
                    state.map.terrain[waterCoordinate.x][waterCoordinate.y] = mapValue.boat;
                    state.inventory.wood -= 5;
                } else {
                    // cannot build boat if inventory wood < 5
                    return;
                }
            } else {
                // other action types are invalid
                return;
            }
            
            // if action successful, actionPoint -1
            state.player.humanStatus.actionPoints -= 1;
        },
        interactWithGrass: (state, action) => {
            // cannot interact if unexplored or no action points
            // cannot interact if this is not a grass or paw
            if (isHumanOnUnexploredCell(state) || state.player.humanStatus.actionPoints < 1) {
                return;
            }
            const currentX = state.player.humanCoordinate.x;
            const currentY = state.player.humanCoordinate.y;
            if (![mapValue.paw, mapValue.grass].includes(getCurrentCell(state, currentX, currentY))) {
                return;
            }
            
            if (actionType === "plantCrop") {
                // - cannot plant crop if no seeds left in inventory
                if (state.player.inventory.seed < 1) {
                    return;
                }
                // - modify map
                // - inventory seed -1
                // - plantEnergy resets to 0
                state.map.terrain[currentX][currentY] = mapValue.seedling;
                state.player.inventory.seed -= 1;
                state.map.plantEnergyMap[currentX][currentY] = 0;
                
            } else if (actionType === "plantTree") {
                // - cannot plant where there's no sapling in inventory
                if (state.player.inventory.sapling < 1) {
                    return;
                }
                // - inventory sapling -1
                // - plantEnergy on cell resets to 0
                state.player.inventory.sapling -= 1;
                state.map.plantEnergyMap[currentX][currentY] = 0;
            } else {
                // invalid action type
                return;
            }
            
            // consume action point
            state.player.humanStatus.actionPoints -= 1;
        },
        interactWithCrop: (state, action) => {
            // cannot interact if unexplored or no action points
            // cannot interact if this is not a grown crop
            if (isHumanOnUnexploredCell(state) || state.player.humanStatus.actionPoints < 1) {
                return;
            }
            const currentX = state.player.humanCoordinate.x;
            const currentY = state.player.humanCoordinate.y;
            if (mapValue.farm !== state.map.terrain[currentX][currentY]) {
                return;
            }
    
            const actionType = action.payload;
            if (actionType === "harvestCrop") {
                // declare number from action payload: random integer between 0 and 2
                const harvestNum = action.payload;
                // - cell becomes grass
                // - seed +2 if number > 0, else +1
                // - crop +(5 + number)
                state.map.terrain[currentX][currentY] = mapValue.grass;
                state.player.inventory.seed += harvestNum > 0 ? 2 : 1;
                state.player.inventory.crop += 5 + harvestNum;
            }
            
            // if action successful, actionPoint -1
            state.player.humanStatus.actionPoints -= 1;
        },
        interactWithHouse: (state, action) => {
            // cannot interact if unexplored
            // cannot interact if this is not a house
            if (isHumanOnUnexploredCell(state)) {
                return;
            }
            const currentX = state.player.humanCoordinate.x;
            const currentY = state.player.humanCoordinate.y;
            if (mapValue.house !== state.map.terrain[currentX][currentY]) {
                return;
            }
            
            const actionType = action.payload;
            if (actionType === "makeFood") {
                // - needs at least 1 action point, but will use all action points this round
                // - inventory food +(sum of fish and crop)
                // - inventory fish resets to 0, crop resets to 0
                if (state.player.status.actionPoints >= 1) {
                    state.player.inventory.food += state.player.inventory.fish + state.player.inventory.crop;
                    state.player.inventory.fish = 0;
                    state.player.inventory.crop = 0;
                    state.player.humanStatus.actionPoints = 0;
                }
            } else if (actionType === "eat") {
                // - inventory food -1, human hunger status +30
                // - does not consume action points
                if (state.player.inventory.food > 0) {
                    state.player.humanStatus.hunger += 30;
                }
            } else if (actionType === "sleep") {
                // - sanity +25 at night, +15 during the day
                // - sets action points to 0
                if (state.player.round % 6 === 5 || state.player.round % 6 === 4) {
                    state.player.humanStatus.sanity += 25;
                } else {
                    state.player.humanStatus.sanity += 15;
                }
                state.player.humanStatus.actionPoints = 0;
            }
        },
        interactWithTree: (state, action) => {
            // cannot interact if unexplored or no action points
            // cannot interact if this is not a tree
            if (isHumanOnUnexploredCell(state) || state.player.humanStatus.actionPoints < 1) {
                return;
            }
            const currentX = state.player.humanCoordinate.x;
            const currentY = state.player.humanCoordinate.y;
            if (mapValue.tree !== state.map.terrain[currentX][currentY]) {
                return;
            }
            
            const actionType = action.payload.actionType;
            if (actionType === "releaseTreeEnergy") {
                // declare number from action payload: random integer between 3 and 8
                let budget = _.clone(action.payload.budget);
                // - inventory sapling +2, wood +1
                state.player.inventory.sapling += 2;
                state.player.inventory.wood += 1;
                // - starting clockwise on top of the cell, if neighbour cell is cursed then change neighbour cell to grass
                const surroundingCells = getSurroundingCells(state, currentX, currentY);
                _.forEach(surroundingCells, cell => {
                    if (mapValue.cursedGrass === cell.mapValue && budget > 0) {
                        state.map.terrain[cell.x][cell.y] = mapValue.grass;
                        budget -= 1;
                    }
                });
                // - overflowed healing restores sanity: +3 per over-heal
                state.player.humanStatus.sanity += 3 * budget;
                // - consume 1 action point
                state.player.humanStatus.actionPoints -= 1;
            }
        },
        interactWithWilt: (state, action) => {
            // cannot interact if unexplored or no action points
            // cannot interact if this is not a wilt
            if (isHumanOnUnexploredCell(state) || state.player.humanStatus.actionPoints < 1) {
                return;
            }
            const currentX = state.player.humanCoordinate.x;
            const currentY = state.player.humanCoordinate.y;
            if (mapValue.tree !== state.map.terrain[currentX][currentY]) {
                return;
            }
            
            const actionType = action.payload;
            if (actionType === "cleanWilt") {
                // - cell becomes grass
                state.map.terrain[currentX][currentY] = mapValue.grass;
                // - consume 1 action point
                state.player.humanStatus.actionPoints -= 1;
            }
        },
        interactWithDog: (state, action) => {
            // cannot interact if unexplored or no action points
            // cannot interact if user and dog do not share the same coordinates
            if (isHumanOnUnexploredCell(state) || state.player.humanStatus.actionPoints < 1) {
                return;
            }
            if (state.player.dogCoordinate.x !== state.player.humanCoordinate.x
                || state.player.dogCoordinate.y !== state.player.humanCoordinate.y) {
                return;
            }
            
            
            const actionType = action.payload;
            if (actionType === "feedDog") {
                if (state.player.inventory.food < 1) {
                    // - cannot feed dog without food
                    return;
                }
                if (!state.player.dogStatus.onTeam) {
                    state.player.dogStatus.onTeam = true;
                }
                state.player.inventory.food -= 1;
                state.player.dogStatus.hunger += 40;
                state.player.humanStatus.actionPoints -= 1;
            }
        }
    }
});