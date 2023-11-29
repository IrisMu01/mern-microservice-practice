import {useSelector, useDispatch} from "react-redux";
import {loadGame, deleteGame} from "../../../store/save/saveThunk";
import Card from "react-bootstrap/Card";
import {DoubleCheckButton} from "../../utils/DoubleCheckButton";

export const GameFile = ({id}) => {
    const gameFile = useSelector(state => state.save.gameSaves[id]);
    const dispatch = useDispatch();

    const doLoad = () => {
        dispatch(loadGame(id));
    }

    const doDelete = () => {
        dispatch(deleteGame(id));
    }
    
    return (
        <Card className="game-file">
            <Card.Body>
                <Card.Title>{new Date(gameFile.created).toLocaleString()}</Card.Title>
                <DoubleCheckButton
                    defaultVariant="outline-success"
                    confirmedVariant="success"
                    size="sm"
                    content={<span>Load</span>}
                    onClickDispatch={doLoad}
                />
                <DoubleCheckButton
                    defaultVariant="outline-danger"
                    confirmedVariant="danger"
                    className="ms-2"
                    size="sm"
                    content={<span>Delete</span>}
                    onClickDispatch={doDelete}
                />
            </Card.Body>
        </Card>
    )
}
