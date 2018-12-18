import { Mob, MobType } from "./Mob";
import { sortByReadingOrder, Point } from "./util";

export class GameMap {
    private readonly grid: string[][] = [];

    public mobs: Mob[] = []

    constructor(input: string, elfAttackPower = 3) {
        const data = input.split('\n');
        data.forEach((row, rowIdx) => {
            this.grid[rowIdx] = [];
            const rowData = row.split('');
            rowData.forEach((cell, cellIdx) => {
                if (cell === 'E' || cell === 'G') {
                    const mobType = cell === 'E' ? MobType.Elf : MobType.Goblin,
                        mob = new Mob(mobType, rowIdx, cellIdx);
                    mob.attackPower = cell === 'E' ? elfAttackPower : 3;
                    this.mobs.push(mob);
                }
                this.grid[rowIdx][cellIdx] = cell;
            });
        });
    }

    private get maxRow() {
        return this.grid.length - 1;
    }

    private get maxCol() {
        return this.grid[0].length - 1;
    }

    processTurn() {
        const mobs = [...this.mobs].sort(sortByReadingOrder),
            elves = mobs.filter(x => x.type === MobType.Elf),
            goblins = mobs.filter(x => x.type === MobType.Goblin),
            getAdjacentOpenCellsFn = (point: Point) => this.getAdjacentOpenCells(point, this.grid),
            getShortestDistanceFn = (point1: Point, point2: Point) => this.findShortestDistanceBetweenPoints(point1, point2);

        let turnEndedEarly = false;

        mobs.forEach((mob, mobIdx) => {
            if (mob.healthPoints < 0) return; // mob was killed by someone who went earlier in the turn
            if (turnEndedEarly) return; // already killed all mobs

            const enemies = mob.type === MobType.Elf ? goblins : elves;
            mob.pickMoveTarget(enemies, getAdjacentOpenCellsFn, getShortestDistanceFn);

            if (mob.moveTarget) {
                const { row, col } = mob.coords,
                    mobSymbol = this.grid[row][col],
                    newCell = this.findNextStepTowardPoint(mob.coords, mob.moveTarget);
                this.grid[row][col] = '.';
                this.grid[newCell.row][newCell.col] = mobSymbol;
                mob.row = newCell.row;
                mob.col = newCell.col;
                mob.moveTarget = null;
            }

            const target = mob.selectEnemyForAttack(enemies);
            if (target) {
                target.healthPoints -= mob.attackPower;
                if (target.healthPoints < 0) {
                    this.mobs.splice(this.mobs.indexOf(target), 1);
                    enemies.splice(enemies.indexOf(target), 1);
                    this.grid[target.row][target.col] = '.';

                    if (this.battleIsOver()) turnEndedEarly = true;
                }
            }
        });

        return !turnEndedEarly;
    }

    public battleIsOver() {
        return this.mobs.every(mob => mob.type === this.mobs[0].type);
    }

    public printGrid(turn: number) {
        console.log(`After ${turn} rounds:`);
        this.grid.forEach(row => console.log(row.join('')));
        console.log([...this.mobs].sort(sortByReadingOrder).map(mob => `${mob.type === MobType.Elf ? 'E' : 'G'}${mob.healthPoints}`).join(' '));
        console.log('');
    }

    private getAdjacentOpenCells(point: Point, grid: string[][]) {
        return this.getAdjacentCells(point, grid)
            .filter(p => grid[p.row][p.col] === '.');
    }

    private getAdjacentCells(point: Point, grid: string[][]) {
        const adjacentCells: Point[] = [],
            { row, col } = point;

        if (row > 0) adjacentCells.push({ row: row - 1, col });
        if (row < this.maxRow) adjacentCells.push({ row: row + 1, col });
        if (col > 0) adjacentCells.push({ row, col: col - 1 });
        if (col < this.maxCol) adjacentCells.push({ row, col: col + 1 });

        return adjacentCells;
    }

    private findShortestDistanceBetweenPoints(point1: Point, point2: Point) {
        const grid = this.populateGridPathfindingData(point1, point2);

        return parseInt(grid[point2.row][point2.col]); // NaN for unreachable points, because they'll still be '#' or '.'
    }

    private findNextStepTowardPoint(startPoint: Point, targetPoint: Point) {
        const grid = this.populateGridPathfindingData(startPoint, targetPoint),
            pointsToProcess = [targetPoint],
            validPoints: Point[] = [];

        while (pointsToProcess.length) {
            const curPoint = pointsToProcess.shift(),
                curValue = parseInt(grid[curPoint.row][curPoint.col]);

            if (curValue === 1) {
                validPoints.push(curPoint);
                continue;
            }

            const adjacentCells = this.getAdjacentCells(curPoint, grid);
            adjacentCells.filter(cell => grid[cell.row][cell.col] === (curValue - 1).toString())
                .forEach(cell => {
                    if (!pointsToProcess.some(pt => pt.col === cell.col && pt.row === cell.row)) {
                        pointsToProcess.push(cell);
                    }
                });
        }

        validPoints.sort(sortByReadingOrder);
        return validPoints[0];
    }

    private populateGridPathfindingData(point1: Point, point2: Point) {
        const grid = this.grid.map(row => [...row]),
            pointsToProcess = [point1];

        grid[point1.row][point1.col] = '0';
        grid[point2.row][point2.col] = '.';

        while (pointsToProcess.length) {
            const curPoint = pointsToProcess.shift(),
                curVal = parseInt(grid[curPoint.row][curPoint.col]),
                openAdjacentPoints = this.getAdjacentOpenCells(curPoint, grid);

            openAdjacentPoints.forEach(point => {
                grid[point.row][point.col] = (curVal + 1).toString();
                pointsToProcess.push(point);
            });
        }

        return grid;
    }
}