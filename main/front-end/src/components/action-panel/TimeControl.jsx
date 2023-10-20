import { useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";

export const TimeControl = () => {
    const round = useSelector(state => state.game.player.round);
    
    return (
        <div className="time-control">
            <div>
                <FontAwesomeIcon icon={"clock"}/>
                <span className="ms-2">
                    Round {round}
                </span>
            </div>
            <Button variant="warning" size="sm">
                <FontAwesomeIcon icon={"backward"}/>
                <span className="ms-2">Reverse time</span>
            </Button>
            <Button variant="success" size="sm">
                <FontAwesomeIcon icon={"forward"}/>
                <span className="ms-2">Forward time</span>
            </Button>
        </div>
    )
}