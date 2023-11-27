import {useSelector, useDispatch} from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {DoubleCheckButton} from "../../utils/DoubleCheckButton";

export const GameFile = ({id}) => {
    const gameFile = useSelector(state => state.save.gameSaves[id]);
    const dispatch = useDispatch();
    
    return (
        <Card>
            <Card.Body>
                <Card.Title>{gameFile.created}</Card.Title>
                <DoubleCheckButton
                    defaultVariant="outline-success"
                    confirmedVariant="success"
                    size="sm"
                    content={<span>Load</span>}
                    onClickDispatch={console.log("load")}
                />
                <DoubleCheckButton
                    defaultVariant="outline-danger"
                    confirmedVariant="danger"
                    size="sm"
                    content={<span>Delete</span>}
                    onClickDispatch={console.log("delete")}
                />
            </Card.Body>
        </Card>
    )
}
