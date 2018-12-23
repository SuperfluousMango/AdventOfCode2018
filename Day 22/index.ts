const depth = 11109,
    targetLoc: Coord = { x: 9, y: 731 };

const ROCKY = 0,
    WET = 1,
    NARROW = 2,
    NO_GEAR = 0,
    TORCH = 1,
    CLIMBING_GEAR = 2;

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const map = buildCave(depth, targetLoc);
    return calcRisk(map, targetLoc);
}

function puzzleB() {
    const map = buildCave(depth, targetLoc),
        navMap = findQuickestRoute(map),
        targetCell = navMap[targetLoc.y][targetLoc.x][TORCH];
    return targetCell.timeToReach;
}

function buildCave(depth: number, targetLoc: Coord) {
    const map: number[][] = [],
        maxX = targetLoc.x + 50,
        maxY = targetLoc.y + 50;

    for (let y = 0; y <= maxY; y++) {
        map[y] = new Array(maxX + 1);

        for (let x = 0; x <= maxX; x++) {
            let geoIndex;

            if ((x === 0 && y === 0) || (x === targetLoc.x && y === targetLoc.y)) {
                geoIndex = 0;
            } else if (y === 0) {
                geoIndex = x * 16807;
            } else if (x === 0) {
                geoIndex = y * 48271;
            } else {
                geoIndex = map[y][x - 1] * map[y - 1][x];
            }

            const erosionLevel = (depth + geoIndex) % 20183
            map[y][x] = erosionLevel;
        }
    }

    return map;
}

function calcRisk(map: number[][], targetLoc: Coord) {
    let totalRisk = 0;
    for (let x = 0; x <= targetLoc.x; x++) {
        for (let y = 0; y <= targetLoc.y; y++) {
            const risk = map[y][x] % 3;
            totalRisk += risk;
        }
    }
    return totalRisk;
}

function findQuickestRoute(erosionMap: number[][]) {
    const maxY = erosionMap.length - 1,
        maxX = erosionMap[0].length - 1;

    const typeMap = erosionMap.map(row => row.map(erosionLevel => erosionLevel % 3)),
        navMap: CaveNav[][][] = [],
        caveMouth = { x: 0, y: 0, z: TORCH, timeToReach: 0 }

    for (let y = 0; y <= maxY; y++) {
        navMap[y] = [];
        for (let x = 0; x <= maxX; x++) {
            const type = typeMap[y][x];
            navMap[y][x] = new Array(3).fill(undefined);
            // These cells are not available for travel
            // The region type constants conveniently happen to correspond with the constant for the corresponding incompatible tool
            navMap[y][x][type] = null;
        }
    }

    const toProcess: CaveNav[] = [caveMouth],
        processMap = new Map<string, number>();
    processMap.set(getKey(caveMouth), caveMouth.timeToReach);

    while (toProcess.length) {
        let cur = toProcess.shift(),
            existingCell = navMap[cur.y][cur.x][cur.z];
        processMap.delete(getKey(cur));

        if (existingCell && existingCell.timeToReach < cur.timeToReach) continue;
        navMap[cur.y][cur.x][cur.z] = cur;

        getAdjacent(cur, typeMap)
            .forEach(adjNav => {
                adjNav.timeToReach = adjNav.z === cur.z
                    ? cur.timeToReach + 1
                    : cur.timeToReach + 7;

                const existingAdj = navMap[adjNav.y][adjNav.x][adjNav.z],
                    adjKey = getKey(adjNav);

                if (existingAdj === null) return; // tool is not compatible with region type
                if (existingAdj && existingAdj.timeToReach <= adjNav.timeToReach) return; // already got there faster another way

                if (processMap.has(adjKey) && processMap.get(adjKey) <= adjNav.timeToReach) return; // already queued a faster way there

                toProcess.push(adjNav);
                processMap.set(adjKey, adjNav.timeToReach);
            });
    }

    return navMap;
}

function getAdjacent(cur: CaveNav, map: number[][]) {
    const maxY = map.length - 1,
        maxX = map[0].length - 1,
        tools = [CLIMBING_GEAR, TORCH, NO_GEAR],
        adj: CaveNav[] = [],
        { x, y } = cur;

    if (y > 0) adj.push({ ...cur, y: y - 1 });
    if (x > 0) adj.push({ ...cur, x: x - 1 });
    if (x < maxX) adj.push({ ...cur, x: x + 1 });
    if (y < maxY) adj.push({ ...cur, y: y + 1 });
    adj.push(
        ...tools.filter(z => z != cur.z)
            .map(z => ({ ...cur, z }))
    );

    return adj;
}

function getKey(nav: CaveNav) {
    return `${nav.x},${nav.y},${nav.z}`;
}

interface Coord {
    x: number;
    y: number;
}

interface CaveNav extends Coord {
    z: number;
    timeToReach?: number;
}
