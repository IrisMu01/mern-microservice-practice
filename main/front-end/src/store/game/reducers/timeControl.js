import { gameUtils } from "../../../utils/utils";
import _ from "lodash";
import {mapValue} from "../../../utils/constants";

const environmentSanityBonus = {};
environmentSanityBonus[mapValue.cursedGrass] = -3;
environmentSanityBonus[mapValue.babyTree] = 1;
environmentSanityBonus[mapValue.tree] = 3;
environmentSanityBonus[mapValue.wilt] = -2;

export const timeControl = {
    forwardTime: (state, lifeNum, deathNum) => {
    
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
        const neighbourCells = gameUtils.getSurroundingCellsForHuman(state);
        _.forEach(neighbourCells, cell => {
            sanityChange += environmentSanityBonus[cell.mapValue] || 0;
        });
        if (state.player.round % 6 === 5 || state.player.round % 6 === 4) {
            sanityChange += 5 * state.player.humanStatus.restPoints;
            sanityChange -= 5 * state.player.humanStatus.workPoints;
        } else {
            sanityChange += 2 * state.player.humanStatus.workPoints;
        }
        state.player.humanStatus.sanity = Math.min(100, state.player.humanStatus.sanity + sanityChange);
    
        // determine next round's available action amount for human & dog: should be variable in the future
        state.player.humanStatus.restPoints = 0;
        state.player.humanStatus.workPoints = 0;
        state.player.humanStatus.actionPoints = 7;
        state.player.dogStatus.actionPoints = 5;
    
        // ============= history =============
    
        // add current coordinates to history; only take the first 3 elements in the coordinates list
        state.history.coordinates = [{
            human: state.player.humanCoordinate,
            dog: state.player.humanCoordinate
        }, ...state.history.coordinates].slice(0, 3);
    
        // ============ do map scan ============
    
        // lifeNum and deathNum are randomly generated numbers between 0 and 100
        let noCursedGrassOrWilt = true;
    
        for (let i = 0; i <= state.terrain.dimension.x; i++) {
            for (let j = 0; j <= state.terrain.dimension.y; j++) {
            
                // boolean tracker for determining winning conditions
                if (mapValue.cursedGrass === state.terrain.map[j][i] || mapValue.wilt === state.terrain.map[j][i]) {
                    noCursedGrassOrWilt = false;
                }
            
                // wilt: if deathNum > 49, spread to a neighbouring cell
                // if spread:
                //      wilt becomes cursed grass
                //      if neighbouring cell has tree/sapling, cell becomes wilt; otherwise cell becomes cursed grassland
                if (mapValue.wilt === state.terrain.map[j][i]) {
                    if (deathNum > 49) {
                        state.terrain.map[j][i] = mapValue.cursedGrass;
                        const wiltSpread = _.floor(deathNum / 25);
                        const affectedCells = gameUtils.getSurroundingCells(state.terrain.map, state.terrain.dimension, i, j).slice(0, wiltSpread);
                        _.forEach(affectedCells, affectedCell => {
                            if (mapValue.babyTree === affectedCell.mapValue || mapValue.tree === affectedCell.mapValue) {
                                state.terrain.map[affectedCell.y][affectedCell.x] = mapValue.wilt;
                            } else {
                                state.terrain.map[affectedCell.y][affectedCell.x] = mapValue.cursedGrass;
                            }
                        });
                    }
                }
    
                // tree: if deathNum > plantEnergy, wilt; else -max(33, deathNum) to plantEnergy
                if (mapValue.tree === state.terrain.map[j][i]) {
                    if (deathNum > state.terrain.plantEnergyMap[j][i]) {
                        state.terrain.map[j][i] = mapValue.wilt;
                    } else {
                        state.terrain.plantEnergyMap[j][i] -= Math.max(33, deathNum);
                    }
                }
    
                // baby tree: if lifeNum < plantEnergy, grow; else +min(50, lifeNum) to plantEnergy
                if (mapValue.babyTree === state.terrain.map[j][i]) {
                    if (lifeNum < state.terrain.plantEnergyMap[j][i]) {
                        state.terrain.map[j][i] = mapValue.tree;
                        state.terrain.plantEnergyMap[j][i] = 100;
                    } else {
                        state.terrain.plantEnergyMap[j][i] += Math.min(50, lifeNum);
                    }
                }
            
                // crop seedling: if lifeNum < plantEnergy, mature; else + min(50, lifeNum) to plantEnergy
                if (mapValue.seedling === state.terrain.map[j][i]) {
                    if (lifeNum < state.terrain.plantEnergyMap[j][i]) {
                        state.terrain.map[j][i] = mapValue.farm;
                    } else {
                        state.terrain.plantEnergyMap[j][i] += Math.min(50, lifeNum);
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
    
        // check success conditions: no cursed grass/wilt
        if (noCursedGrassOrWilt) {
            console.log("Winning conditions met");
            state.gameStatus = true;
        }
    },
    reverseTime: (state, lifeNum) => {
    
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
    
        // using lifeNum, a random number between 50 and 100
        for (let i = 0; i <= state.terrain.dimension.x; i++) {
            for (let j = 0; j <= state.terrain.dimension.y; j++) {
                // wilt: becomes tree; cell plantEnergy gets assigned lifeNum
                if (mapValue.wilt === state.terrain.map[j][i]) {
                    state.terrain.map[j][i] = mapValue.tree;
                    state.terrain.plantEnergyMap[j][i] = lifeNum;
                }
            
                // farm: if plantEnergy < lifeNum, revert to seedling
                if (mapValue.farm === state.terrain.map[j][i]) {
                    if (state.terrain.plantEnergyMap[j][i] < lifeNum) {
                        state.terrain.map[j][i] = mapValue.seedling;
                    }
                }
            }
        }
    
        // ============= complete map scan ================
    
        // decrement round, increment true round, increment reverse count
        state.player.round -= 1;
        state.player.trueRound += 1;
        state.history.reverseCount += 1;
    }
};