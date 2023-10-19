import { useDispatch } from "react-redux";
import { explore, interactWithWater, interactWithGrass, interactWithCrop, interactWithHouse, interactWithTree, interactWithWilt, interactWithDog } from "../../store/game/gameSlice";
import { mapValue } from "../../utils/constants";
import { getSurroundingCells, getDirectSurroundingCells, getRandomInteger } from "../../utils/utils";
import _ from "lodash";

export const ActionControl = () => {
    const dispatch = useDispatch();
    
    return (
        <div className="action-control">
        
        </div>
    )
}