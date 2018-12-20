import { inputData } from './data';

const [puzzleA, puzzleB] = puzzles();
console.log(`Puzzle A solution: ${puzzleA}`);
console.log(`Puzzle B solution: ${puzzleB}`);

function puzzles() {
    const { grid, minX, maxX, minY, maxY } = splitData(inputData);
    let lowestWaterLevel = 0,
        changed: boolean;
    do {
        changed = false;
        for (let y = maxY - 1; y >= 0; y--) {
            if (y > lowestWaterLevel) continue;
            const row = grid[y];

            for (let x = minX; x <= maxX; x++) {
                const cell = grid[y][x],
                    cellBelow = grid[y + 1][x],
                    cellLeft = grid[y][x - 1],
                    cellRight = grid[y][x + 1];

                // Empty spaces and settled water are boring
                if (cell === ' ' || cell === '~') continue;

                if (cell === '+') {
                    if (cellBelow === ' ') {
                        // Cell below spring is empty - drop water
                        // (Apparently elven springs start at ground level and fill downward...smh)
                        grid[y + 1][x] = '|';
                        lowestWaterLevel = Math.max(lowestWaterLevel, y + 1);
                        changed = true;
                    }
                    continue;
                }

                if (cell === '|') {
                    // cell below is flowing water - do nothing
                    if (cellBelow === '|') continue;

                    if (cellBelow === ' ') {
                        // cell below is empty - drop
                        grid[y + 1][x] = '|';
                        lowestWaterLevel = Math.max(lowestWaterLevel, y + 1);
                        changed = true;
                        continue;
                    }

                    // Cell below is clay or settled water - spread to sides
                    if (cellLeft === ' ') {
                        grid[y][x - 1] = '|';
                        changed = true;
                    }
                    if (cellRight === ' ') {
                        grid[y][x + 1] = '|';
                        changed = true;
                    }
                    continue;
                }

                if (cell === '#') {
                    // These aren't interesting unless everything between two clay walls is flowing water
                    // with something solid beneath (clay or settled water). In that case, all the flowing
                    // water is magically converted to settled water via some sort of Dwarf-Fortress-esque
                    // physics.
                    const nextClaySite = row.indexOf('#', x + 1);
                    let waterShouldSettle = true;
                    for (let cx = x + 1; cx < nextClaySite; cx++) {
                        if (grid[y][cx] !== '|' || !(grid[y + 1][cx] === '#' || grid[y + 1][cx] === '~')) {
                            waterShouldSettle = false;
                            break;
                        }
                    }
                    if (nextClaySite < 0 || !waterShouldSettle) continue;

                    for (let cx = x + 1; cx < nextClaySite; cx++) {
                        grid[y][cx] = '~';
                        changed = true;
                    }
                }
            }
        }
    } while (changed);

    // grid.forEach(row => console.log('[' + row.slice(minX, maxX + 1).join('') + ']'));
    const waterCount = grid.slice(minY, maxY + 1)
        .reduce((acc, row) => acc + row.filter(c => c === '+' || c === '|' || c === '~').length, 0);

    const settledWaterCount = grid.slice(minY, maxY + 1)
        .reduce((acc, row) => acc + row.filter(c => c === '~').length, 0);

    return [waterCount, settledWaterCount];
}

function splitData(input: string) {
    const regex = /(\w)=(\d+), (\w)=(\d+)\.\.(\d+)/,
        temp = input.split('\n')
            .map(row => {
                const parse = regex.exec(row);
                return (parse[1] === 'x')
                    ? { x: parseInt(parse[2]), yRange: { min: parseInt(parse[4]), max: parseInt(parse[5]) } } as ClayDeposit
                    : { y: parseInt(parse[2]), xRange: { min: parseInt(parse[4]), max: parseInt(parse[5]) } } as ClayDeposit
            });
    let minX = Number.MAX_SAFE_INTEGER,
        maxX = Number.MIN_SAFE_INTEGER,
        minY = Number.MAX_SAFE_INTEGER,
        maxY = Number.MIN_SAFE_INTEGER;
    temp.forEach(deposit => {
        if (deposit.x && deposit.x < minX) minX = deposit.x;
        if (deposit.x && deposit.x > maxX) maxX = deposit.x;
        if (deposit.xRange && deposit.xRange.min < minX) minX = deposit.xRange.min;
        if (deposit.xRange && deposit.xRange.max > maxX) maxX = deposit.xRange.max;
        if (deposit.y && deposit.y < minY) minY = deposit.y;
        if (deposit.y && deposit.y > maxY) maxY = deposit.y;
        if (deposit.yRange && deposit.yRange.min < minY) minY = deposit.yRange.min;
        if (deposit.yRange && deposit.yRange.max > maxY) maxY = deposit.yRange.max;
    });
    // Allow space on either side for water to overflow
    minX--;
    maxX++;

    const grid: string[][] = Array(maxY);
    for (let y = 0; y <= maxY; y++) grid[y] = Array(maxX + 2).fill(' ');

    temp.forEach(deposit => {
        if (deposit.x) {
            for (let y = deposit.yRange.min; y <= deposit.yRange.max; y++) grid[y][deposit.x] = '#';
        } else {
            for (let x = deposit.xRange.min; x <= deposit.xRange.max; x++) grid[deposit.y][x] = '#';
        }
    });
    grid[0][500] = '+';
    return { grid, minX, maxX, minY, maxY } as DepositData;
}

interface Range {
    min: number;
    max: number;
}

interface ClayDeposit {
    x?: number;
    xRange?: Range;
    y?: number;
    yRange?: Range;
}

interface DepositData {
    grid: string[][];
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}
