import { useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProgressBar from "react-bootstrap/ProgressBar";

export const HumanStatus = () => {
    const humanStatus = useSelector(state => state.game.player.humanStatus);
    
    return (
        <div className="human-status">
            <FontAwesomeIcon className="status-entity-icon fa-4x" icon={"user"}/>
            <div className="statuses">
                <div className="status py-1">
                    <FontAwesomeIcon className="status-icon hunger" icon={"drumstick-bite"}/>
                    <div className="progress-bar-wrapper">
                        <ProgressBar
                            striped variant={"success"}
                            min={0} max={100} now={humanStatus.hunger}
                            label={humanStatus.hunger}
                        />
                    </div>
                </div>
                <div className="status pt-1">
                    <FontAwesomeIcon className="status-icon sanity" icon={"brain"}/>
                    <div className="progress-bar-wrapper">
                        <ProgressBar
                            striped variant={"success"}
                            min={0} max={100} now={humanStatus.sanity}
                            label={humanStatus.sanity}
                        />
                    </div>
                </div>
                <div className="status">
                    <FontAwesomeIcon className="status-icon action-points" icon={"hand"}/>
                    <small className="ms-2 mt-0">
                        {humanStatus.actionPoints} action points left this round
                    </small>
                </div>
            </div>
        </div>
    )
}
