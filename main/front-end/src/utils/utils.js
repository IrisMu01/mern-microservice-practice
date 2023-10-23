const getSurroundingCellsInternal = (map, mapDimension, x, y) => {
    if (x > mapDimension.x || y > mapDimension.y) {
        return [];
    }
    const cells = [];
    for (let i = Math.max(0, x-1); i <= Math.min(x+1, mapDimension.x); i++) {
        for (let j = Math.max(0, y-1); j <= Math.min(y+1, mapDimension.y); j++) {
            if (i !== x || j !== y) {
                cells.push({
                    x: i,
                    y: j,
                    mapValue: map[j][i]
                });
            }
        }
    }
    return cells;
};

export const gameUtils = {
    getSurroundingCellsForHuman: (state) => {
        const x = state.player.humanCoordinate.x;
        const y = state.player.humanCoordinate.y;
        const mapDimension = state.terrain.dimension;
        const map = state.terrain.map;
        return getSurroundingCellsInternal(map, mapDimension, x, y);
    },
    getSurroundingCellsForDog: (state) => {
        const x = state.player.dogCoordinate.x;
        const y = state.player.dogCoordinate.y;
        const mapDimension = state.terrain.dimension;
        const map = state.terrain.map;
        return getSurroundingCellsInternal(map, mapDimension, x, y);
    },
    getSurroundingCells: getSurroundingCellsInternal,
    getCurrentCellForHuman: (state) => {
        return state.terrain.map[state.player.humanCoordinate.y][state.player.humanCoordinate.x];
    },
    getCurrentCellForDog: (state) => {
        return state.terrain.map[state.player.dogCoordinate.y][state.player.dogCoordinate.x];
    },
    isHumanOnUnexploredCell: (state) => {
        return !state.terrain.map[state.player.humanCoordinate.y][state.player.humanCoordinate.x];
    },
    isDogOnUnexploredCell: (state) => {
        return !state.terrain.map[state.player.dogCoordinate.y][state.player.dogCoordinate.x];
    },
    getRandomInteger: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};