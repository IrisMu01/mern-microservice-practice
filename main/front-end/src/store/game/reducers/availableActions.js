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
        const explorable = _.filter(surroundingCells, cell => fogMap[cell.x][cell.y]);
        state.availableActions.human.explore = (fogMap[humanCoordinate.x][humanCoordinate.y] || explorable.length > 0)
            && actionPointsAvailable;
    
        state.availableActions.human.feedDog = humanCoordinate.x === dogCoordinate.x && humanCoordinate.y === dogCoordinate.y
            && state.player.inventory.food > 0 && actionPointsAvailable;
    
        state.availableActions.human.buildBoat = map[humanCoordinate.x][humanCoordinate.y] === mapValue.water
            && state.player.inventory.wood >= 5 && actionPointsAvailable;
        state.availableActions.human.fish = map[humanCoordinate.x][humanCoordinate.y] === mapValue.water
            && actionPointsAvailable;
    
        state.availableActions.human.startFarm = map[humanCoordinate.x][humanCoordinate.y] === mapValue.grass
            && state.player.inventory.seed > 0 && actionPointsAvailable;
    
        state.availableActions.human.plantTree = map[humanCoordinate.x][humanCoordinate.y] === mapValue.grass
            && state.player.inventory.sapling > 0 && actionPointsAvailable;
    
        state.availableActions.human.harvest = map[humanCoordinate.x][humanCoordinate.y] === mapValue.farm
            && actionPointsAvailable;
    
        state.availableActions.human.makeFood = map[humanCoordinate.x][humanCoordinate.y] === mapValue.house
            && (state.player.inventory.crop + state.player.inventory.fish > 0) && actionPointsAvailable;
    
        state.availableActions.human.eat = map[humanCoordinate.x][humanCoordinate.y] === mapValue.house;
    
        state.availableActions.human.rest = map[humanCoordinate.x][humanCoordinate.y] === mapValue.house;
    
        state.availableActions.human.releaseTreeEnergy = map[humanCoordinate.x][humanCoordinate.y] === mapValue.tree
            && actionPointsAvailable;
    
        state.availableActions.human.cleanWilt = map[humanCoordinate.x][humanCoordinate.y] === mapValue.wilt
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
        const mapDimension = state.terrain.dimension;
        const humanCoordinate = state.player.humanCoordinate;
        const dogCoordinate = state.player.dogCoordinate;
        const actionPointsAvailable = state.player.dogStatus.actionPoints;
    
        const surroundingCells = getSurroundingCells(map, mapDimension, dogCoordinate.x, dogCoordinate.y);
        const explorable = _.filter(surroundingCells, cell => fogMap[cell.x][cell.y]);
        state.availableActions.dog.explore = (fogMap[dogCoordinate.x][dogCoordinate.y] || explorable.length > 0)
            && actionPointsAvailable;
    
        state.availableActions.dog.cleanWilt = map[dogCoordinate.x][dogCoordinate.y] === mapValue.wilt
            && actionPointsAvailable;
    
        // updates availability of feed dog without going through all the checks in the human method.
        state.availableActions.human.feedDog = dogCoordinate.x === humanCoordinate.x && dogCoordinate.y === humanCoordinate.y
            && state.player.inventory.food > 0 && state.player.humanStatus.actionPoints;
    }
};
