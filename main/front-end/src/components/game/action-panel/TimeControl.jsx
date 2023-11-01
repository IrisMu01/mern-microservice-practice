import { useDispatch, useSelector } from "react-redux";
import { forwardTime, reverseTime }  from "../../../store/game/gameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {gameUtils} from "../../../utils/utils";
import { DoubleCheckButton } from "../../utils/DoubleCheckButton";

export const TimeControl = () => {
    const dispatch = useDispatch();
    const round = useSelector(state => state.game.player.round);
    const trueRound = useSelector(state => state.game.player.trueRound);
    const canReverseTime = round >= 2 && trueRound >= 2;
    const isNight = round % 6 === 5 || round % 6 === 4;
    
    const doForwardTime = () => {
        dispatch(forwardTime({
            lifeNum: gameUtils.getRandomInteger(0, 100),
            deathNum: gameUtils.getRandomInteger(0, 100)
        }));
    }
    const doReverseTime = () => {
        if (canReverseTime) {
            dispatch(reverseTime({
                lifeNum: gameUtils.getRandomInteger(0, 100)
            }));
        }
    }
    
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
            <DoubleCheckButton
                defaultVariant="warning"
                confirmedVariant="danger"
                size="sm"
                onClickDispatch={doReverseTime}
                content={(
                    <div>
                        <FontAwesomeIcon icon={"backward"}/>
                        <span className="ms-2">Reverse time</span>
                    </div>
                )}
            />
            <DoubleCheckButton
                defaultVariant="warning"
                confirmedVariant="success"
                size="sm"
                onClickDispatch={doForwardTime}
                content={(
                    <div>
                        <FontAwesomeIcon icon={"forward"}/>
                        <span className="ms-2">Forward time</span>
                    </div>
                )}
            />
        </div>
    )
}
