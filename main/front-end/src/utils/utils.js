export const getSurroundingCells = (map, mapDimension, x, y) => {
    if (x > mapDimension.x || y > mapDimension.y) {
        return [];
    }
    const cells = [];
    for (let i = x-1; i < Math.min(x+1, mapDimension.x); i++) {
        for (let j = y-1; j < Math.min(y+1, mapDimension.y); j++) {
            if (i !== x || j !== y) {
                cells.push({
                    x: i,
                    y: j,
                    mapValue: map[i][j]
                });
            }
        }
    }
    return cells;
};

export const getDirectSurroundingCells = (map, mapDimension, x, y) => {
    if (x > mapDimension.x || y > mapDimension.y) {
        return [];
    }
    const cells = [];
    for (let i = x-1; i < Math.min(x+1, mapDimension.x); i++) {
        if (i !== x) {
            const j = y;
            cells.push({
                x: i,
                y: j,
                mapValue: map[i][j]
            });
        }
    }
    for (let j = y-1; j < Math.min(y+1, mapDimension.y); j++) {
        if (j !== y) {
            const i = x;
            cells.push({
                x: i,
                y: j,
                mapValue: map[i][j]
            });
        }
    }
    return cells;
}

export const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}