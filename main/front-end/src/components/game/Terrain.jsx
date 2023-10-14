import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const block = {
    b: { className: "baby-tree", component: <FontAwesomeIcon icon={"tree"} />},
    c: { className: "cursed-grass", component: <FontAwesomeIcon icon={"skull"}/> },
    d: { className: "dog", component: <FontAwesomeIcon icon={"dog"}/> },
    f: { className: "farm", component: <FontAwesomeIcon icon={"wheat-awn"}/> },
    g: { className: "grass" },
    h: { className: "house", component: <FontAwesomeIcon icon={"house"}/> },
    p: { className: "paw", component: <FontAwesomeIcon icon={"paw"}/> },
    r: { className: "river",  component: <FontAwesomeIcon icon={"water"}/> },
    s: { className: "seedling", component: <FontAwesomeIcon icon={"seedling"}/> },
    t: { className: "tree", component: <FontAwesomeIcon icon={"tree"}/> },
    w: { className: "wilt", component: <FontAwesomeIcon icon={"plant-wilt"}/> }
};

const mockMap = [
    [block.c, block.c, block.c, block.c, block.r, block.d],
    [block.c, block.t, block.t, block.g, block.r, block.g],
    [block.c, block.g, block.f, block.f, block.r, block.r],
    [block.t, block.g, block.s, block.h, block.r, block.r],
    [block.c, block.b, block.g, block.r, block.r, block.w],
    [block.r, block.c, block.r, block.r, block.c, block.p]
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