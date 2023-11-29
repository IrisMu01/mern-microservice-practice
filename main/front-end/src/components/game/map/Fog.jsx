import { useSelector } from "react-redux";

export const Fog = () => {
    const fogMap = useSelector(state => state.game.terrain.fogMap);
    
    return (
        <div className="map-layer">
            {fogMap.map((row, y) => (
                <div className="map-row" key={`fog-${y}`}>
                    {row.map((isUnknown, x) => (
                        <div className={`cell${isUnknown ? " fog" : ""}`} key={`fog-${x}-${y}`}>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
