import _ from "lodash";
import {mapValue} from "../../../utils/constants";

export const movements = {
    switchBetweenHumanAndDog: (state) => {
        // cannot switch if dog not on team or dead
        if (!state.player.dogStatus.onTeam || !state.player.dogStatus.alive) {
            return;
        }
        state.player.switchedToHuman = !state.player.switchedToHuman;
    },
    moveHuman: (state, direction) => {
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
            default:
                return;
        }
        const targetCell = state.map.terrain[targetCoordinate.x][targetCoordinate.y];
    
        const targetIsWater = mapValue.water === targetCell || mapValue.boat === targetCell || mapValue.waterDeep === targetCell;
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
    moveDog: (state, direction) => {
        // declare variable based on action.payload
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
            default:
                return;
        }
        const targetCell = state.map.terrain[targetCoordinate.x][targetCoordinate.y];
    
        if (state.player.dogStatus.onBoat && (mapValue.water === targetCell || mapValue.waterDeep === targetCell)) {
            // cannot move if onBoat - human boat movement already updates dog coordinate
            return;
        } else if (state.player.dogStatus.onBoat && mapValue.water !== targetCell && mapValue.boat !== targetCell) {
            // if onBoat and walking onto adjacent land, then set onBoat to false
            state.player.dogStatus.onBoat = false;
        } else if (!state.player.dogStatus.onBoat && mapValue.water === targetCell) {
            // if not onBoat, cannot walk into water
            return;
        } else if (!state.player.dogStatus.onBoat && mapValue.boat === targetCell) {
            // if map coordinate points to boat: set onBoat to true
            state.player.dogStatus.onBoat = true;
        }
    
        // change dog coordinate based on w-a-s-d
        state.player.dogCoordinate = targetCoordinate;
    }
};