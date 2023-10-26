import {useDispatch, useSelector} from "react-redux";
import {resetGame} from "../store/game/gameSlice";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const WinLoseModal = () => {
    const gameStatus = useSelector(state => state.game.gameStatus);
    const dispatch = useDispatch();
    const doReset = () => {
        dispatch(resetGame());
    }
    
    if (gameStatus !== null) {
        return (
            <div className="win-lose-modal">
                {
                    gameStatus ?
                        (
                            <div className="win-lose-message winning">
                                <div>You have won!</div>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={doReset}
                                >
                                    <FontAwesomeIcon icon={"refresh"}/>
                                    <span className="ms-2">
                                       Start A New Game
                                    </span>
                                </Button>
                            </div>
                        ) :
                        (
                            <div className="win-lose-message losing">
                                <div>You have lost the game</div>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={doReset}
                                >
                                    <FontAwesomeIcon icon={"refresh"}/>
                                    <span className="ms-2">
                                        Restart
                                    </span>
                                </Button>
                            </div>
                        )
                }
            
            </div>
        )
    } else {
        return (<div></div>)
    }
}
