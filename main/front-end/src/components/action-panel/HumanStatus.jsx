import { useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProgressBar from "react-bootstrap/ProgressBar";

export const HumanStatus = () => {
    const humanStatus = useSelector(state => state.game.player.humanStatus);
    
    return (
        <div className="human-status">
            <FontAwesomeIcon className="status-entity-icon fa-3x" icon={"user"}/>
            <div className="statuses">
                <div className="status">
                    <FontAwesomeIcon className="hunger" icon={"drumstick-bite"}/>
                    <div className="progress-bar-wrapper">
                        <ProgressBar
                            striped variant={"success"}
                            min={0} max={100} now={humanStatus.hunger}
                            label={humanStatus.hunger}
                        />
                    </div>
                </div>
                <div className="status">
                    <FontAwesomeIcon className="sanity" icon={"brain"}/>
                    <div className="progress-bar-wrapper">
                        <ProgressBar
                            striped variant={"success"}
                            min={0} max={100} now={humanStatus.sanity}
                            label={humanStatus.sanity}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}