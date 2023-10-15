import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const block = {
    bo: { className: "boat", component: <FontAwesomeIcon icon={"sailboat"}/> },
    bt: { className: "baby-tree", component: <FontAwesomeIcon icon={"tree"} />},
    cg: { className: "cursed-grass", component: <FontAwesomeIcon icon={"skull"}/> },
    fa: { className: "farm", component: <FontAwesomeIcon icon={"wheat-awn"}/> },
    gr: { className: "grass" },
    ho: { className: "house", component: <FontAwesomeIcon icon={"house"}/> },
    pa: { className: "paw", component: <FontAwesomeIcon icon={"paw"}/> },
    ri: { className: "river",  component: <FontAwesomeIcon icon={"water"}/> },
    se: { className: "seedling", component: <FontAwesomeIcon icon={"seedling"}/> },
    tr: { className: "tree", component: <FontAwesomeIcon icon={"tree"}/> },
    wi: { className: "wilt", component: <FontAwesomeIcon icon={"plant-wilt"}/> }
};

const mockMap = [
    [block.cg, block.cg, block.cg, block.cg, block.ri, block.gr],
    [block.cg, block.tr, block.tr, block.gr, block.ri, block.gr],
    [block.cg, block.gr, block.fa, block.fa, block.ri, block.ri],
    [block.tr, block.gr, block.se, block.ho, block.ri, block.ri],
    [block.cg, block.bt, block.gr, block.ri, block.ri, block.wi],
    [block.ri, block.cg, block.ri, block.ri, block.cg, block.pa]
];

export const Terrain = () => {
    return (
        <div className="terrain-layer">
            {mockMap.map((row, y) => (
                <div className="d-flex w-100 justify-content-center" key={`terrain-${y}`}>
                    {row.map((cell, x) => (
                        <div className={`cell ${cell.className}`} key={`terrain-${x}-${y}`}>
                            {cell.component}
                            {/*<div>({x}, {y})</div>*/}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}