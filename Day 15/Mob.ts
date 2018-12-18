import { Point, sortByReadingOrder, calcManhattanDistance } from "./util";

export class Mob {
    public attackPower = 3;
    public healthPoints = 200;
    public moveTarget: Point;

    constructor(
        public type: MobType,
        public row: number,
        public col: number
    ) { }

    public get coords(): Point {
        return { row: this.row, col: this.col };
    }

    pickMoveTarget(
        enemies: Mob[],
        getOpenCellsFn: (point: Point) => Point[],
        getShortestDistanceFn: (point1: Point, point2: Point) => number
    ) {
        const adjacentEnemies = this.getAdjacentEnemies(enemies);
        if (adjacentEnemies.length) return;

        const cellSet = enemies.reduce((acc, mob) => acc.concat(getOpenCellsFn(mob.coords)), [] as Point[])
            .reduce((acc, point) => acc.add(point), new Set<Point>()),
            openCellsNearEnemies = Array.from(cellSet.values()), // running it through the Set removes any duplicates
            cellDistanceMap = openCellsNearEnemies.reduce((acc, cell) => {
                const distance = getShortestDistanceFn(this.coords, cell);
                return (isNaN(distance)) ? acc : acc.set(cell, distance);
            }, new Map<Point, number>()),
            sortedCellsWithDistances = Array.from(cellDistanceMap.entries())
                .sort((a, b) => a[1] === b[1] ? sortByReadingOrder(a[0], b[0]) : a[1] - b[1]),
            closestCells = sortedCellsWithDistances.map(([cell, _]) => cell);

        if (closestCells.length) this.moveTarget = closestCells[0];
    }

    selectEnemyForAttack(enemies: Mob[]) {
        const adjacentEnemies = this.getAdjacentEnemies(enemies);

        if (!adjacentEnemies.length) return null;

        adjacentEnemies.sort((a, b) => a.healthPoints === b.healthPoints ? sortByReadingOrder(a, b) : a.healthPoints - b.healthPoints);
        return adjacentEnemies[0];
    }

    private getAdjacentEnemies(enemies: Mob[]) {
        return enemies.filter(mob => calcManhattanDistance(this.coords, mob.coords) === 1)
            .filter(mob => mob.healthPoints > 0);
    }
}

export enum MobType {
    Elf = 0,
    Goblin = 1
}
