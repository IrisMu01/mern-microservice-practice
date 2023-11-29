import {useSelector} from "react-redux";

export const NightOverlay = () => {
    const dimension = useSelector(state => state.game.terrain.dimension);
    const round = useSelector(state => state.game.player.round);
    const isNight = round % 6 === 5 || round % 6 === 4;
    
    if (isNight) {
        return (
            <div className="map-layer">
                {[...Array(dimension.x + 1)].map((i, y) => (
                    <div className="map-row" key={`night-overlay-row-${y}`}>
                        {[...Array(dimension.y + 1)].map((j, x) => (
                            <div className="cell night-overlay" key={`night-overlay-cell-${x}-${y}`}></div>
                        ))}
                    </div>
                ))}
            </div>
        )
    } else {
        return (<div></div>)
    }
}
