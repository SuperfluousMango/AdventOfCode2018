export function calcManhattanDistance(point1: Point, point2: Point) {
    return Math.abs(point1.col - point2.col) + Math.abs(point1.row - point2.row);
}

export function sortByReadingOrder(a: Point, b: Point) {
    return a.row === b.row
        ? a.col - b.col
        : a.row - b.row;
}

export interface Point {
    row: number,
    col: number
}
