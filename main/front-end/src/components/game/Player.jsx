import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const mapWidth = 6;
const mapHeight = 6;
const playerCoordinate = { x: 3, y: 2 };

const playerOnCell = (x, y) => {
    return playerCoordinate.x === x && playerCoordinate.y === y;
}

export const Player = () => {
    return (
        <div className="player-layer">
            {[...Array(mapHeight)].map((i, y) => (
                <div className="d-flex w-100 justify-content-center" key={`player-${y}`}>
                    {[...Array(mapWidth)].map((j, x) => (
                        <div className={`cell${playerOnCell(x, y) ? " player" : ""}`} key={`player-${x}-${y}`}>
                            {playerOnCell(x, y) && (
                                <FontAwesomeIcon icon={"user"}/>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}