import { useDispatch } from "react-redux";
import { explore, interactWithWater, interactWithGrass, interactWithCrop, interactWithHouse, interactWithTree, interactWithWilt, interactWithDog } from "../../store/game/gameSlice";
import { mapValue } from "../../utils/constants";
import { getSurroundingCells, getDirectSurroundingCells, getRandomInteger } from "../../utils/utils";
import _ from "lodash";

const getAvailableHumanActions = (map, fogMap, mapDimension, x, y, dogCoordinate) => {
    if (fogMap[x][y]) {
        return [{
            label: "Explore",
            action: explore,
            payload: {}
        }];
    }
    // todo determine available actions based on inventory;
    //  this function might be better off inside gameSlice
    //  mutating a store part called availableActions
    const availableActions = [];
    
    if (x === dogCoordinate.x && y === dogCoordinate.y) {
        availableActions.push({
            label: "Feed dog",
            action: interactWithDog,
            payload: "feedDog"
        });
    }
    
    const surroundingCells = getSurroundingCells(map, mapDimension, x, y);
    const explorable = _.filter(surroundingCells, cell => fogMap[cell.x][cell.y]);
    if (explorable.length > 0) {
        availableActions.push({
            label: "Explore",
            action: explore,
            payload: {}
        });
    }
    
    const directSurroundingCells = getDirectSurroundingCells(map, mapDimension, x, y);
    const waterNearby = _.filter(directSurroundingCells, cell => cell.mapValue === mapValue.river);
    if (waterNearby.length > 0) {
        const cellToInteract = waterNearby[0];
        availableActions.push({
            label: "Build boat",
            action: interactWithWater,
            payload: {
                actionType: "boat",
                waterCoordinate: { x: cellToInteract.x, y: cellToInteract.y },
                fishingLuck: 0
            }
        });
        availableActions.push({
            label: "Fish",
            action: interactWithWater,
            payload: {
                actionType: "fish",
                waterCoordinate: { x: cellToInteract.x, y: cellToInteract.y },
                fishingLuck: getRandomInteger(0, 100)
            }
        });
    }
    
    // adding additional actions for special map values
    switch (map[x][y]) {
        case mapValue.grass:
            availableActions.push({
                label: "Start farmland",
                action: interactWithGrass,
                payload: "plantCrop"
            });
            availableActions.push({
                label: "Plant tree",
                action: interactWithGrass,
                payload: "plantTree"
            });
            break;
        case mapValue.farm:
            availableActions.push({
                label: "Harvest",
                action: interactWithCrop,
                payload: {
                    actionType: "harvestCrop",
                    harvestNum: getRandomInteger(0, 2)
                }
            });
            break;
        case mapValue.house:
            availableActions.push({
                label: "Make food",
                action: interactWithHouse,
                payload: "makeFood"
            });
            availableActions.push({
                label: "Eat",
                action: interactWithHouse,
                payload: "eat"
            });
            availableActions.push({
                label: "Rest",
                action: interactWithHouse,
                payload: "sleep"
            });
            break;
        case mapValue.tree:
            availableActions.push({
                label: "Release tree energy",
                action: interactWithTree,
                payload: {
                    actionType: "releaseTreeEnergy",
                    budget: getRandomInteger(3, 8)
                }
            });
            break;
        case mapValue.wilt:
            availableActions.push({
                label: "Clean up wilt",
                action: interactWithWilt,
                payload: "cleanWilt"
            });
    }
    
    return availableActions;
}

const getAvailableDogActions = (map, fogMap, x, y) => {
    // explore, clean wilt
};


export const ActionControl = () => {
    const dispatch = useDispatch();
    
    return (
        <div className="action-control">
        
        </div>
    )
}