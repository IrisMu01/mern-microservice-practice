import { useDispatch, useSelector } from "react-redux";
import { test } from "../../store/game/gameSlice";
import _ from "lodash";

export const ActionControl = () => {
    const dispatch = useDispatch();
    dispatch(test()); // initializes the available actions
    const availableActions = useSelector(state => state.game.availableActions);
    console.log(availableActions);
    _.forEach(availableActions.human, (value, key) => {
        if (value) {
            console.log(key);
        }
    });
    
    return (
        <div className="action-control">
        
        </div>
    )
}