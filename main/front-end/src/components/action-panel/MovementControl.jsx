import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { switchBetweenHumanAndDog, moveHuman, moveDog } from "../../store/game/gameSlice";

export const MovementControl = () => {
    const dispatch = useDispatch();
    const switchedToHuman = useSelector(state => state.game.player.switchedToHuman);
    
    const humanDogSwitch = () => {
        console.log("switch between human and dog");
        dispatch(switchBetweenHumanAndDog());
    }
    const move = (direction) => () => {
        if (switchedToHuman) {
            console.log("moving human: " + direction);
            dispatch(moveHuman(direction));
        } else {
            console.log("moving dog: " + direction);
            dispatch(moveDog(direction));
        }
    };
    
    return (
        <div className="movement-control">
            <div className="d-flex justify-content-center">
                <div className="movement-icon" onClick={move("w")}>
                    <FontAwesomeIcon icon={"chevron-up"}/>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="movement-icon" onClick={move("a")}>
                    <FontAwesomeIcon icon={"chevron-left"}/>
                </div>
                <div className="movement-icon hidden" onClick={humanDogSwitch}>
                    <FontAwesomeIcon icon={switchedToHuman ? "user" : "dog"}/>
                </div>
                <div className="movement-icon" onClick={move("d")}>
                    <FontAwesomeIcon icon={"chevron-right"}/>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="movement-icon" onClick={move("s")}>
                    <FontAwesomeIcon icon={"chevron-down"}/>
                </div>
            </div>
        </div>
    )
}