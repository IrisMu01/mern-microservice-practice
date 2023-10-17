import {getSurroundingCells} from "../../../utils/utils";
import _ from "lodash";
import {mapValue} from "../../../utils/constants";

export const forwardTime = (state, action) => {
    
    // ============ human & dog status changes =============
    
    // change human hunger: drop by 15 to a minimum of 0
    state.player.humanStatus.hunger = Math.max(0, state.player.humanStatus.hunger - 15);
    
    // change dog hunger: drop by 10; dog dies if its hunger drops to -30
    let dogDeathThisRound = false;
    state.player.dogStatus.hunger = Math.max(-30, state.player.dogStatus.hunger - 10);
    if (state.player.dogStatus.hunger < -30 && state.player.dogStatus.alive) {
        state.player.dogStatus.alive = false;
        state.player.switchedToHuman = true;
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
    const neighbourCells = getSurroundingCells(state.terrain.map, state.terrain.dimension, state.player.humanCoordinate.x, state.player.humanCoordinate.y);
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
    state.player.humanStatus.sanity += sanityChange;
    
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
                    const affectedCells = getSurroundingCells(state.terrain.map, state.terrain.dimension, i, j).slice(0, wiltSpread);
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
};
