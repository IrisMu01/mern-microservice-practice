import {mapValue} from "../../../utils/constants";

export const reverseTime = (state, action) => {
    
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
    const lifeNum = action.payload.lifeNum;
    
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
};