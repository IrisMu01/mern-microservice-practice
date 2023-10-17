import { useSelector } from "react-redux";

export const Fog = () => {
    const fogMap = useSelector(state => state.game.terrain.fogMap);
    
    return (
        <div className="fog-layer">
            {fogMap.map((row, y) => (
                <div className="d-flex w-100 justify-content-center" key={`fog-${y}`}>
                    {row.map((isUnknown, x) => (
                        <div className={`cell${isUnknown ? " unknown" : ""}`} key={`fog-${x}-${y}`}>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}