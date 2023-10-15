import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const mapWidth = 6;
const mapHeight = 6;
const playerCoordinate = { x: 3, y: 2 };
const dogCoordinate = {x: 1, y: 6};

export const Player = () => {
    const PlayerOnCell = ({x, y}) => {
        if (playerCoordinate.x === x && playerCoordinate.y === y) {
            return (
                <div className="cell player" key={`player-${x}-${y}`}>
                    <FontAwesomeIcon icon={"user"}/>
                </div>
            );
        } else if (dogCoordinate.x === x && dogCoordinate.y === y) {
            // todo do not render if dog is not on the team
            return (
                <div className="cell dog" key={`player-${x}-${y}`}>
                    <FontAwesomeIcon icon={"dog"}/>
                </div>
            );
        } else {
            return (<div key={`player-${x}-${y}`}></div>);
        }
    }
    
    return (
        <div className="player-layer">
            {[...Array(mapHeight)].map((i, y) => (
                <div className="d-flex w-100 justify-content-center" key={`player-${y}`}>
                    {[...Array(mapWidth)].map((j, x) => (
                        <PlayerOnCell x={x} y={y}/>
                    ))}
                </div>
            ))}
        </div>
    )
}