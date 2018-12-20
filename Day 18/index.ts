import { inputData } from './data';

const OPEN_CELL = '.',
    TREE_CELL = '|',
    LUMBERYARD_CELL = '#';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    let initGrid = splitInput(inputData);
    const gridData = { grid: initGrid, maxY: initGrid.length - 1, maxX: initGrid[0].length - 1 },
        minutesToProcess = 10;

    return processGrid(gridData, minutesToProcess);
}

function puzzleB() {
    let initGrid = splitInput(inputData);
    const gridData = { grid: initGrid, maxY: initGrid.length - 1, maxX: initGrid[0].length - 1 },
        minutesToProcess = 1000 * 1000 * 1000;

    return processGrid(gridData, minutesToProcess);
}

function splitInput(input: string) {
    return input.split('\n');
}

function processGrid(gridData: GridData, minutesToProcess: number) {
    let { maxX, maxY } = gridData,
        dict = new Map<string, number>(),
        foundSequence = false;

    for (let minute = 1; minute <= minutesToProcess; minute++) {
        let newGrid = new Array(maxY + 1).fill('');

        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                const cell = gridData.grid[y][x],
                    adj = getAdjacentCells(x, y, gridData);
                let newCell;

                switch (cell) {
                    case OPEN_CELL:
                        newCell = hasAdjacent(adj, TREE_CELL, 3) ? TREE_CELL : OPEN_CELL;
                        break;
                    case TREE_CELL:
                        newCell = hasAdjacent(adj, LUMBERYARD_CELL, 3) ? LUMBERYARD_CELL : TREE_CELL;
                        break;
                    case LUMBERYARD_CELL:
                        newCell = hasAdjacent(adj, LUMBERYARD_CELL) && hasAdjacent(adj, TREE_CELL) ? LUMBERYARD_CELL : OPEN_CELL;
                        break;
                }

                newGrid[y] += newCell;
            }
        }

        const flatGrid = newGrid.join('\n'),
            minuteOfLastAppearance = dict.get(flatGrid);

        if (!foundSequence) {
            // Turns out I had the same grid value show up multiple times without actually being the same layout
            // To make it more fun, the period was 35, which matched that of many other inputs. Once I finally
            // started hashing the maps, the correct sequence showed up.
            if (minuteOfLastAppearance) {
                foundSequence = true;
                const sequenceLen = minute - minuteOfLastAppearance;
                while (minute + sequenceLen < minutesToProcess) minute += sequenceLen;
            } else {
                dict.set(flatGrid, minute);
            }
        }

        gridData.grid = newGrid;
    }

    return getGridValue(gridData.grid);
}

function getAdjacentCells(x: number, y: number, gridData: GridData) {
    const { grid, maxX, maxY } = gridData,
        cells = [];

    if (x > 0) cells.push(grid[y][x - 1]);
    if (x < maxX) cells.push(grid[y][x + 1]);
    if (y > 0) cells.push(grid[y - 1][x]);
    if (y < maxY) cells.push(grid[y + 1][x]);
    if (x > 0 && y > 0) cells.push(grid[y - 1][x - 1]);
    if (x < maxX && y < maxY) cells.push(grid[y + 1][x + 1]);
    if (x > 0 && y < maxY) cells.push(grid[y + 1][x - 1]);
    if (x < maxX && y > 0) cells.push(grid[y - 1][x + 1]);

    return cells;
}

function hasAdjacent(adj: string[], type: string, min = 1) {
    return adj.filter(c => c === type).length >= min;
}

function getGridValue(grid: string[]) {
    const treeCount = grid.reduce((acc, row) => acc + row.split('').filter(c => c === TREE_CELL).length, 0),
        lumberyardCount = grid.reduce((acc, row) => acc + row.split('').filter(c => c === LUMBERYARD_CELL).length, 0);
    return treeCount * lumberyardCount;
}

interface GridData {
    grid: string[];
    maxX: number;
    maxY: number
}
