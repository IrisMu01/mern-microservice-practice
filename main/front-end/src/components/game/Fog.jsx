const unknowns = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0]
];

export const Fog = () => {
    return (
        <div className="fog-layer">
            {unknowns.map((row, y) => (
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