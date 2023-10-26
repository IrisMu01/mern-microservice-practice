import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetGame } from "../../store/game/gameSlice";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ResetGame = () => {
    const dispatch = useDispatch();
    const [ confirmReset, setConfirmReset ] = useState(null);
    const doReset = () => {
        if (confirmReset) {
            dispatch(resetGame());
            setConfirmReset(false);
        } else {
            setConfirmReset(true)
        }
    };
    
    return (
        <div className="mt-2">
            <Button
                variant={confirmReset? 'outline-danger' : 'outline-warning'}
                size="sm"
                className="w-100 text-center"
                onClick={doReset}
            >
                <FontAwesomeIcon icon={"refresh"}/>
                <span className="ms-2">
                    Restart Game
                </span>
            </Button>
        </div>
    )
}
