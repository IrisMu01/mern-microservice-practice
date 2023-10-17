import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

export const Player = () => {
    const dimension = useSelector(state => state.game.terrain.dimension);
    const humanCoordinate = useSelector(state => state.game.player.humanCoordinate);
    const dogCoordinate = useSelector(state => state.game.player.dogCoordinate);
    const fogMap = useSelector(state => state.game.terrain.fogMap);
    
    const PlayerOnCell = ({x, y}) => {
        if (humanCoordinate.x === x && humanCoordinate.y === y) {
            return (
                <div className="cell player" key={`player-${x}-${y}`}>
                    <FontAwesomeIcon icon={"user"}/>
                </div>
            );
        } else if (dogCoordinate.x === x && dogCoordinate.y === y && fogMap[x][y]) {
            return (
                <div className="cell dog" key={`player-${x}-${y}`}>
                    <FontAwesomeIcon icon={"dog"}/>
                </div>
            );
        } else {
            return (<div className="cell" key={`player-${x}-${y}`}></div>);
        }
    }
    
    return (
        <div className="player-layer">
            {[...Array(dimension.x + 1)].map((i, y) => (
                <div className="d-flex w-100 justify-content-center" key={`player-row-${y}`}>
                    {[...Array(dimension.y + 1)].map((j, x) => (
                        <PlayerOnCell x={x} y={y}/>
                    ))}
                </div>
            ))}
        </div>
    )
}