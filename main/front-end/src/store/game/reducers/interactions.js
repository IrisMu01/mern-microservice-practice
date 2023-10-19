import {getSurroundingCells} from "../../../utils/utils";
import _ from "lodash";
import {mapValue} from "../../../utils/constants";

const getCurrentCell = (state, x, y) => {
    if (x > state.terrain.dimension.x || y > state.terrain.dimension.y) {
        return null;
    } else {
        return state.terrain.map[x][y];
    }
};

const isHumanOnUnexploredCell = (state) => {
    return state.map.fogMap[state.player.humanCoordinate.x][state.player.humanCoordinate.y];
};

// todo separate each action from the larger interact function

export const explore = (state, action) => {
    const surroundingCells = getSurroundingCells(state.terrain.map, state.terrain.dimension, state.player.humanCoordinate.x, state.player.humanCoordinate.y);
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
};

export const interactWithWater = (state, action) => {
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
};

export const interactWithGrass = (state, action) => {
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
    
    const actionType = action.payload;
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
};

export const interactWithCrop = (state, action) => {
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
    
    const actionType = action.payload.actionType;
    if (actionType === "harvestCrop") {
        // declare number from action payload: random integer between 0 and 2
        const harvestNum = action.payload.harvestNum;
        // - cell becomes grass
        // - seed +2 if number > 0, else +1
        // - crop +(5 + number)
        state.map.terrain[currentX][currentY] = mapValue.grass;
        state.player.inventory.seed += harvestNum > 0 ? 2 : 1;
        state.player.inventory.crop += 5 + harvestNum;
    }
    
    // if action successful, actionPoint -1
    state.player.humanStatus.actionPoints -= 1;
};

export const interactWithHouse = (state, action) => {
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
        // todo bug fixes 
        //  - players are supposed to use all action points at night for sleeping
        //  - scale sanity restoration based on time of day and remaining action points
    }
};

export const interactWithTree = (state, action) => {
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
        const surroundingCells = getSurroundingCells(state.terrain.map, state.terrain.dimension, currentX, currentY);
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
};

export const interactWithWilt = (state, action) => {
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
};

export const interactWithDog = (state, action) => {
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