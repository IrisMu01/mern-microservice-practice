import { useDispatch, useSelector } from "react-redux";
import { determineAvailableActions, humanAction, dogAction } from "../../store/game/gameSlice";
import { dogActionTypes, humanActionTypes } from "../../utils/constants";
import { gameUtils } from "../../utils/utils";
import _ from "lodash";
import { DoubleCheckButton } from "../utils/DoubleCheckButton";

export const ActionControl = () => {
    const dispatch = useDispatch();
    dispatch(determineAvailableActions());
    const switchedToHuman = useSelector(state => state.game.player.switchedToHuman);
    const availableActions = useSelector(state => state.game.availableActions);
    
    let availableActionKeys = [];
    if (switchedToHuman) {
        _.forEach(availableActions.human, (value, key) => {
            if (value) {
                availableActionKeys.push(key);
            }
        });
    } else {
        _.forEach(availableActions.dog, (value, key) => {
            if (value) {
                availableActionKeys.push(key);
            }
        });
    }
    
    const doAction = (actionKey) => () => {
        if (switchedToHuman) {
            const payload = { actionType: humanActionTypes[actionKey] };
            if (humanActionTypes[actionKey] === humanActionTypes.fish) {
                payload.luckNumber = gameUtils.getRandomInteger(0, 100);
            } else if (humanActionTypes[actionKey] === humanActionTypes.harvest) {
                payload.luckNumber = gameUtils.getRandomInteger(0, 2);
            } else if (humanActionTypes[actionKey] === humanActionTypes.releaseTreeEnergy) {
                payload.luckNumber = gameUtils.getRandomInteger(3, 8);
            }
            dispatch(humanAction(payload));
        } else {
            dispatch(dogAction({ actionType: dogActionTypes[actionKey] }));
        }
    };
    
    return (
        <div className="d-flex flex-column h-100">
            <div className="mt-auto mb-auto w-100 action-control">
                {availableActionKeys.map(key => (
                    <div className="me-2 mb-2" key={`action-${key}`}>
                        <DoubleCheckButton
                            defaultVariant="secondary"
                            confirmedVariant="success"
                            size="sm"
                            onClickDispatch={doAction(key)}
                            content={(
                                <span> {humanActionTypes[key]} </span>
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
