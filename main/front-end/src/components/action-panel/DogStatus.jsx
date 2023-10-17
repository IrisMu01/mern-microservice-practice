import { useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProgressBar from "react-bootstrap/ProgressBar";

export const DogStatus = () => {
    const dogStatus = useSelector(state => state.game.player.dogStatus);
    
    return (
        <div className="dog-status">
            <FontAwesomeIcon className="status-entity-icon fa-3x" icon={"dog"}/>
            <div className="statuses">
                <div className="status">
                    <FontAwesomeIcon className="hunger" icon={"drumstick-bite"}/>
                    <div className="progress-bar-wrapper">
                        <ProgressBar
                            striped variant={"success"}
                            min={0} max={100} now={dogStatus.hunger}
                            label={dogStatus.hunger}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}