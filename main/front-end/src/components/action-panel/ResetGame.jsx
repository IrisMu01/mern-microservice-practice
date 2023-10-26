import { useDispatch } from "react-redux";
import { resetGame } from "../../store/game/gameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DoubleCheckButton } from "../utils/DoubleCheckButton";

export const ResetGame = () => {
    const dispatch = useDispatch();
    
    const doResetGame = () => {
        dispatch(resetGame());
    }
    
    return (
        <div className="mt-2">
            <DoubleCheckButton
                defaultVariant="outline-warning"
                confirmedVariant="outline-danger"
                className="w-100 text-center"
                size="sm"
                onClickDispatch={doResetGame}
                content={(
                    <div>
                        <FontAwesomeIcon icon={"refresh"}/>
                        <span className="ms-2">
                            Restart Game
                        </span>
                    </div>
                )}
            />
        </div>
    )
}
