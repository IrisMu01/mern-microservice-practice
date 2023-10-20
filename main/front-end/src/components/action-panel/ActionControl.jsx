import { useDispatch, useSelector } from "react-redux";
import { determineAvailableActions } from "../../store/game/gameSlice";
import { humanActionTypes } from "../../utils/constants";
import Button from "react-bootstrap/Button";
import _ from "lodash";

export const ActionControl = () => {
    const dispatch = useDispatch();
    dispatch(determineAvailableActions());
    const availableActions = useSelector(state => state.game.availableActions);
    
    let availableActionKeys = [];
    _.forEach(availableActions.human, (value, key) => {
        if (value) {
            availableActionKeys.push(key);
        }
    });
    
    return (
        <div className="d-flex flex-column h-100">
            <div className="mt-auto mb-auto w-100 action-control">
                {availableActionKeys.map(key => (
                    <div className="me-2 mb-2" key={`action-${key}`}>
                        <Button variant="secondary" size="sm">
                            {humanActionTypes[key]}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}