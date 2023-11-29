import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const cell = {
    bo: { className: "boat", component: <FontAwesomeIcon icon={"sailboat"}/> },
    bt: { className: "baby-tree", component: <FontAwesomeIcon icon={"tree"} />},
    cb: { className: "cursed-baby-tree", component: <FontAwesomeIcon icon={"tree"} />},
    cg: { className: "cursed-grass", component: <FontAwesomeIcon icon={"skull"}/> },
    ct: { className: "cursed-tree", component: <FontAwesomeIcon icon={"tree"} />},
    fa: { className: "farm", component: <FontAwesomeIcon icon={"wheat-awn"}/> },
    gr: { className: "grass" },
    ho: { className: "house", component: <FontAwesomeIcon icon={"house"}/> },
    pa: { className: "paw", component: <FontAwesomeIcon icon={"paw"}/> },
    wa: { className: "water",  component: <FontAwesomeIcon icon={"water"}/> },
    wd: { className: "water-deep",  component: <FontAwesomeIcon icon={"water"}/> },
    se: { className: "seedling", component: <FontAwesomeIcon icon={"seedling"}/> },
    tr: { className: "tree", component: <FontAwesomeIcon icon={"tree"}/> },
    wi: { className: "wilt", component: <FontAwesomeIcon icon={"plant-wilt"}/> }
};

export const Terrain = () => {
    const terrain = useSelector(state => state.game.terrain.map);
    
    return (
        <div className="map-layer">
            {terrain.map((row, y) => (
                <div className="map-row" key={`terrain-${y}`}>
                    {row.map((cellName, x) => (
                        <div className={`cell ${cell[cellName].className}`} key={`terrain-${x}-${y}`}>
                            {cell[cellName].component}
                            {/*<div>({x}, {y})</div>*/}
                        </div>
                        /*<div>({cellName})</div>*/
                    ))}
                </div>
            ))}
        </div>
    )
}
