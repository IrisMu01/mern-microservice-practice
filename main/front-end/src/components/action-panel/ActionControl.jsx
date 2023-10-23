import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { determineAvailableActions, humanAction, dogAction } from "../../store/game/gameSlice";
import { dogActionTypes, humanActionTypes } from "../../utils/constants";
import { gameUtils } from "../../utils/utils";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
    
    const [ confirmedHumanActionKey, setConfirmedHumanActionKey ] = useState(null);
    const [ confirmedDogActionKey, setConfirmedDogActionKey ] = useState(null);
    const doAction = (actionKey) => () => {
        if (switchedToHuman) {
            if (confirmedHumanActionKey === actionKey) {
                const payload = { actionType: humanActionTypes[actionKey] };
                if (humanActionTypes[actionKey] === humanActionTypes.fish) {
                    payload.luckNumber = gameUtils.getRandomInteger(0, 100);
                } else if (humanActionTypes[actionKey] === humanActionTypes.harvest) {
                    payload.luckNumber = gameUtils.getRandomInteger(0, 2);
                } else if (humanActionTypes[actionKey] === humanActionTypes.releaseTreeEnergy) {
                    payload.luckNumber = gameUtils.getRandomInteger(3, 8);
                }
                setConfirmedHumanActionKey(null);
                dispatch(humanAction(payload));
            } else {;
                setConfirmedHumanActionKey(actionKey);
            }
        } else {
            if (confirmedDogActionKey === actionKey) {
                dispatch(dogAction({ actionType: dogActionTypes[actionKey] }));
                setConfirmedDogActionKey(null);
            } else {
                setConfirmedDogActionKey(actionKey);
            }
        }
    };
    
    const isConfirmingAction = (key) => {
        return key === (switchedToHuman ? confirmedHumanActionKey : confirmedDogActionKey);
    }
    
    return (
        <div className="d-flex flex-column h-100">
            <div className="mt-auto mb-auto w-100 action-control">
                {availableActionKeys.map(key => (
                    <div className="me-2 mb-2" key={`action-${key}`}>
                        <Button
                            variant={isConfirmingAction(key) ? 'success' : 'secondary'}
                            size="sm"
                            onClick={doAction(key)}
                        >
                            {humanActionTypes[key]}
                            {isConfirmingAction(key) && (
                                <span className="ms-2">
                                    <FontAwesomeIcon icon={"check"}/>
                                </span>
                            )}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}