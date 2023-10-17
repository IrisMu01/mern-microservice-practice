import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

export const MovementControl = () => {
    const switchedToHuman = useSelector(state => state.game.player.switchedToHuman);
    return (
        <div className="movement-control">
            <div className="d-flex justify-content-center">
                <div className="movement-icon">
                    <FontAwesomeIcon icon={"chevron-up"}/>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="movement-icon">
                    <FontAwesomeIcon icon={"chevron-left"}/>
                </div>
                <div className="movement-icon hidden">
                    <FontAwesomeIcon icon={switchedToHuman ? "user" : "dog"}/>
                </div>
                <div className="movement-icon">
                    <FontAwesomeIcon icon={"chevron-right"}/>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="movement-icon">
                    <FontAwesomeIcon icon={"chevron-down"}/>
                </div>
            </div>
        </div>
    )
}