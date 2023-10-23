import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forwardTime, reverseTime }  from "../../store/game/gameSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import {gameUtils} from "../../utils/utils";

export const TimeControl = () => {
    const dispatch = useDispatch();
    const round = useSelector(state => state.game.player.round);
    const trueRound = useSelector(state => state.game.player.trueRound);
    const canReverseTime = round >= 2 && trueRound >= 2;
    const isNight = round % 6 === 5 || round % 6 === 4;
    
    const doForwardTime = () => {
        if (forwardTimeConfirmed) {
            setForwardTimeConfirmed(false);
            dispatch(forwardTime({
                lifeNum: gameUtils.getRandomInteger(0, 100),
                deathNum: gameUtils.getRandomInteger(0, 100)
            }));
        } else {
            setForwardTimeConfirmed(true);
        }
    }
    const doReverseTime = () => {
        if (reverseTimeConfirmed) {
            setReverseTimeConfirmed(false);
            dispatch(reverseTime({
                lifeNum: gameUtils.getRandomInteger(0, 100)
            }));
        } else {
            setReverseTimeConfirmed(true);
        }
    }
    
    const [ forwardTimeConfirmed, setForwardTimeConfirmed ] = useState(false);
    const [ reverseTimeConfirmed, setReverseTimeConfirmed ] = useState(false);
    
    return (
        <div className="time-control">
            <div>
                <FontAwesomeIcon icon={"clock"}/>
                <span className="ms-2">
                    Round {round}
                </span>
                {isNight && (
                    <span className="ms-2">
                        <FontAwesomeIcon icon={"moon"}/>
                    </span>
                )}
            </div>
            <Button
                onClick={canReverseTime ? doReverseTime : () => {}}
                variant={canReverseTime ? (reverseTimeConfirmed ? "danger" : "warning") : "secondary"}
                size="sm"
            >
                <FontAwesomeIcon icon={"backward"}/>
                <span className="ms-2">Reverse time</span>
            </Button>
            <Button
                onClick={doForwardTime}
                variant={forwardTimeConfirmed ? "success" : "warning"}
                size="sm"
            >
                <FontAwesomeIcon icon={"forward"}/>
                <span className="ms-2">Forward time</span>
            </Button>
        </div>
    )
}