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
        const mapDimension = state.terrain.dimension;
        
        switch (direction) {
            case "w":
                targetCoordinate.y = Math.max(0, targetCoordinate.y - 1);
                break;
            case "a":
                targetCoordinate.x = Math.max(0, targetCoordinate.x - 1);
                break;
            case "s":
                targetCoordinate.y = Math.min(mapDimension.y, targetCoordinate.y + 1);
                break;
            case "d":
                targetCoordinate.x = Math.min(mapDimension.x, targetCoordinate.x + 1);
                break;
            default:
                return;
        }
        
        // cannot walk into unknown parts of the map
        if (state.terrain.fogMap[targetCoordinate.y][targetCoordinate.x]) {
            return;
        }
        
        const targetCell = state.terrain.map[targetCoordinate.y][targetCoordinate.x];
    
        const targetIsWater = mapValue.water === targetCell || mapValue.waterDeep === targetCell;
        if (state.player.humanStatus.onBoat && !targetIsWater) {
            // if onBoat, and walking onto land: set onBoat to false
            state.player.humanStatus.onBoat = false;
        } else if (state.player.humanStatus.onBoat && targetIsWater) {
            // if onBoat, and walking into water: change player/boat/dog coordinate, swap map boat/water cells
            const tempCell = _.clone(targetCell);
            state.terrain.map[targetCoordinate.y][targetCoordinate.x] = state.terrain.map[startingCoordinate.y][startingCoordinate.x];
            state.terrain.map[startingCoordinate.y][startingCoordinate.x] = tempCell;
        } else if (!state.player.humanStatus.onBoat && mapValue.waterDeep === targetCell) {
            // if not onBoat, cannot walk into water
            return;
        }
    
        // change player coordinate based on w-a-s-d
        state.player.humanCoordinate = targetCoordinate;
    
        // if human on the same boat with dog, change dog coordinate based on player coordinate
        if (state.player.dogCoordinate.x === startingCoordinate.x && state.player.dogCoordinate.y === startingCoordinate.y
            && state.player.humanStatus.onBoat) {
            state.player.dogCoordinate = targetCoordinate;
        }
    
        // if map coordinate points to boat: set onBoat to true
        if (!state.player.humanStatus.onBoat && mapValue.boat === targetCell) {
            state.player.humanStatus.onBoat = true;
        }
        
        // if target coordinate is cursed grass: sanity -5
        if (mapValue.cursedGrass === targetCell) {
            state.player.humanStatus.sanity -= 5;
        }
    },
    moveDog: (state, direction) => {
        // declare variable based on action.payload
        const startingCoordinate = _.cloneDeep(state.player.dogCoordinate);
        const targetCoordinate = {x: startingCoordinate.x, y: startingCoordinate.y};
        const mapDimension = state.terrain.dimension;
    
        switch (direction) {
            case "w":
                targetCoordinate.y = Math.max(0, targetCoordinate.y - 1);
                break;
            case "a":
                targetCoordinate.x = Math.max(0, targetCoordinate.x - 1);
                break;
            case "s":
                targetCoordinate.y = Math.min(mapDimension.y, targetCoordinate.y + 1);
                break;
            case "d":
                targetCoordinate.x = Math.min(mapDimension.x, targetCoordinate.x + 1);
                break;
            default:
                return;
        }
    
        // cannot walk into unknown parts of the map
        if (state.terrain.fogMap[targetCoordinate.y][targetCoordinate.x]) {
            return;
        }
        
        // swimming on water costs dog hunger
        const targetCell = state.terrain.map[targetCoordinate.y][targetCoordinate.x];
        if (targetCell === mapValue.water || targetCell === mapValue.waterDeep) {
            state.player.dogStatus.hunger -= 3;
        }
    
        // change dog coordinate based on w-a-s-d
        state.player.dogCoordinate = targetCoordinate;
    }
};