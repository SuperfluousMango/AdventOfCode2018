const serialNumber = 1718,
    gridSize = 300;

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const grid = populateGrid();
    let maxVal = Number.MIN_SAFE_INTEGER,
        coordsOfMaxVal;

    const blockSize = 3,
        maxCoord = gridSize - blockSize + 1;
    for (let x = 1; x <= maxCoord; x++) {
        for (let y = 1; y <= maxCoord; y++) {
            const power = getPowerForBlock(x, y, blockSize, grid);
            if (power > maxVal) {
                maxVal = power;
                coordsOfMaxVal = `${x},${y}`;
            }
        }
    }

    return coordsOfMaxVal;
}

// This brute force approach is _very_ unoptimized. Something more like a summed-area table would have been far faster to run
function puzzleB() {
    const grid = populateGrid();
    let maxVal = Number.MIN_SAFE_INTEGER,
        coordsOfMaxVal;

    for (let size = 1; size <= gridSize; size++) {
        console.log(`size = ${size}`);
        const maxCoord = gridSize - size + 1;
        for (let x = 1; x <= maxCoord; x++) {
            for (let y = 1; y <= maxCoord; y++) {
                const power = getPowerForBlock(x, y, size, grid);
                if (power > maxVal) {
                    maxVal = power;
                    coordsOfMaxVal = `${x},${y},${size}`;
                }
            }
        }
    }

    console.log(`Max power - ${maxVal}`);
    return coordsOfMaxVal;
}

function populateGrid() {
    const grid = new Array(gridSize);
    for (let x = 1; x <= gridSize; x++) {
        grid[x - 1] = new Array(gridSize);
        for (let y = 1; y <= gridSize; y++) {
            const rackId = x + 10,
                basePowerLevel = (rackId * y + serialNumber) * rackId,
                powerLevel = parseInt(basePowerLevel.toString().substr(-3, 1)) - 5;
            grid[x - 1][y - 1] = powerLevel;
        }
    }

    return grid;
}

function getPowerForBlock(x: number, y: number, blockSize = 3, grid: number[][]) {
    let power = 0;
    for (let xAdj = 0; xAdj < blockSize; xAdj++) {
        power += grid[x - 1 + xAdj].slice(y - 1, y - 1 + blockSize)
            .reduce((acc, val) => acc + val, 0);
    }

    return power;
}
