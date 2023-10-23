import { gameUtils } from "../../../utils/utils";
import _ from "lodash";
import {mapValue} from "../../../utils/constants";

export const availableActions = {
    determineForHuman: (state) => {
        const map = state.terrain.map;
        const fogMap = state.terrain.fogMap;
        const humanCoordinate = state.player.humanCoordinate;
        const dogCoordinate = state.player.dogCoordinate;
        const actionPointsAvailable = state.player.humanStatus.actionPoints;
    
        const surroundingCells = gameUtils.getSurroundingCellsForHuman(state);
        const explorable = _.filter(surroundingCells, cell => fogMap[cell.y][cell.x]);
        state.availableActions.human.explore = (fogMap[humanCoordinate.y][humanCoordinate.x] || explorable.length > 0)
            && actionPointsAvailable;
    
        state.availableActions.human.feedDog = humanCoordinate.x === dogCoordinate.x && humanCoordinate.y === dogCoordinate.y
            && state.player.inventory.food > 0 && actionPointsAvailable;
    
        state.availableActions.human.buildBoat = map[humanCoordinate.y][humanCoordinate.x] === mapValue.water
            && state.player.inventory.wood >= 5 && actionPointsAvailable;
        state.availableActions.human.fish = [mapValue.water, mapValue.boat].includes(map[humanCoordinate.y][humanCoordinate.x])
            && actionPointsAvailable;
    
        state.availableActions.human.startFarm = map[humanCoordinate.y][humanCoordinate.x] === mapValue.grass
            && state.player.inventory.seed > 0 && actionPointsAvailable;
    
        state.availableActions.human.plantTree = map[humanCoordinate.y][humanCoordinate.x] === mapValue.grass
            && state.player.inventory.sapling > 0 && actionPointsAvailable;
    
        state.availableActions.human.harvest = map[humanCoordinate.y][humanCoordinate.x] === mapValue.farm
            && actionPointsAvailable;
    
        state.availableActions.human.makeFood = map[humanCoordinate.y][humanCoordinate.x] === mapValue.house
            && (state.player.inventory.crop + state.player.inventory.fish > 0) && actionPointsAvailable;
    
        state.availableActions.human.eat = map[humanCoordinate.y][humanCoordinate.x] === mapValue.house
            && state.player.inventory.food > 0;
    
        state.availableActions.human.rest = map[humanCoordinate.y][humanCoordinate.x] === mapValue.house;
    
        state.availableActions.human.releaseTreeEnergy = map[humanCoordinate.y][humanCoordinate.x] === mapValue.tree
            && actionPointsAvailable;
    
        state.availableActions.human.cleanWilt = map[humanCoordinate.y][humanCoordinate.x] === mapValue.wilt
            && actionPointsAvailable;
    },
    determineForDog: (state) => {
        const onTeam = state.player.dogStatus.onTeam;
        if (!onTeam) {
            _.forEach(state.availableActions.dog, (value, key) => {
                state.availableActions.dog[key] = false;
            });
            return;
        }
    
        const map = state.terrain.map;
        const fogMap = state.terrain.fogMap;
        const humanCoordinate = state.player.humanCoordinate;
        const dogCoordinate = state.player.dogCoordinate;
        const actionPointsAvailable = state.player.dogStatus.actionPoints;
    
        const surroundingCells = gameUtils.getSurroundingCellsForDog(state);
        const explorable = _.filter(surroundingCells, cell => fogMap[cell.y][cell.x]);
        state.availableActions.dog.explore = (fogMap[dogCoordinate.y][dogCoordinate.x] || explorable.length > 0)
            && actionPointsAvailable;
    
        state.availableActions.dog.cleanWilt = map[dogCoordinate.y][dogCoordinate.x] === mapValue.wilt
            && actionPointsAvailable;
    
        // updates availability of feed dog without going through all the checks in the human method.
        state.availableActions.human.feedDog = dogCoordinate.x === humanCoordinate.x && dogCoordinate.y === humanCoordinate.y
            && state.player.inventory.food > 0 && state.player.humanStatus.actionPoints;
    }
};
