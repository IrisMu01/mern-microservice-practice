import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const block = {
    c: { className: "cursed-grass", component: <FontAwesomeIcon icon={"skull"}/> },
    d: { className: "dog", component: <FontAwesomeIcon icon={"dog"}/> },
    f: { className: "farm", component: <FontAwesomeIcon icon={"wheat-awn"}/> },
    g: { className: "grass" },
    h: { className: "house", component: <FontAwesomeIcon icon={"house"}/> },
    p: { className: "paw", component: <FontAwesomeIcon icon={"paw"}/> },
    t: { className: "tree", component: <FontAwesomeIcon icon={"tree"}/> },
    u: { className: "unknown" },
    w: { className: "water",  component: <FontAwesomeIcon icon={"water"}/> }
};

const mockMap = [
    [block.c, block.c, block.c, block.c, block.w, block.d],
    [block.c, block.t, block.t, block.g, block.w, block.w],
    [block.c, block.g, block.f, block.f, block.w, block.w],
    [block.t, block.g, block.f, block.h, block.w, block.w],
    [block.u, block.g, block.g, block.w, block.w, block.w],
    [block.u, block.u, block.w, block.w, block.c, block.p]
];

export const Terrain = () => {
    return (
        <div className="terrain">
            {mockMap.map((row, x) => (
                <div className="d-flex w-100 justify-content-center" key={x}>
                    {row.map((cell, y) => (
                        <div className={`cell ${cell.className}`} key={`${x}-${y}`}>
                            {cell.component}
                            {/*<div>({x}, {y})</div>*/}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}