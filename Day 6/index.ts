import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
//     const inputData = `1, 1
// 1, 6
// 8, 3
// 3, 4
// 5, 5
// 8, 9`;
    const landmarks = splitData(inputData),
        xVals = landmarks.map(val => val.x),
        yVals = landmarks.map(val => val.y),
        minX = Math.min(...xVals),
        maxX = Math.max(...xVals),
        minY = Math.min(...yVals),
        maxY = Math.max(...yVals),
        pointsCloseToLandmarks = new Map<Point, Point[]>();

    for (let x = minX + 1; x < maxX; x++) {
        for (let y = minY + 1; y < maxY; y++) {
            const curPoint = { x, y },
                closestLandmark = getClosestLandmark(curPoint, landmarks);
            if (closestLandmark !== null) {
                if (!pointsCloseToLandmarks.has(closestLandmark)) pointsCloseToLandmarks.set(closestLandmark, []);
                pointsCloseToLandmarks.get(closestLandmark).push(curPoint);
            }
        }
    }

    // Get rid of the outer layer of landmarks because their areas are infinite
    for (let x = minX; x <= maxX; x++) {
        const topPoint = { x, y: minY },
            bottomPoint = { x, y: maxY };
        pointsCloseToLandmarks.delete(getClosestLandmark(topPoint, landmarks));
        pointsCloseToLandmarks.delete(getClosestLandmark(bottomPoint, landmarks));
    }
    for (let y = minY; y <= maxY; y++) {
        const leftPoint = { x: minX, y },
            rightPoint = { x: maxX, y };
        pointsCloseToLandmarks.delete(getClosestLandmark(leftPoint, landmarks));
        pointsCloseToLandmarks.delete(getClosestLandmark(rightPoint, landmarks));
    }

    return Math.max(...Array.from(pointsCloseToLandmarks.values()).map(arr => arr.length));
}

function puzzleB() {
    const landmarks = splitData(inputData),
        xVals = landmarks.map(val => val.x),
        yVals = landmarks.map(val => val.y),
        minX = Math.min(...xVals),
        maxX = Math.max(...xVals),
        minY = Math.min(...yVals),
        maxY = Math.max(...yVals),
        dangerDistance = 10000,
        safePoints: Point[] = [];
    
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const curPoint = { x, y },
                summedDistance = landmarks.map(landmark => calcDistance(curPoint, landmark))
                    .reduce((acc, val) => acc + val, 0);
            if (summedDistance < dangerDistance) safePoints.push(curPoint);
        }
    }

    return safePoints.length;
}

function splitData(input: string) {
    return input.split('\n')
        .map(row => {
            const coords = row.split(', ');
            return {
                x: parseInt(coords[0]),
                y: parseInt(coords[1])
            } as Point;
        })
        .sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
}

function getClosestLandmark(curPoint: Point, landmarks: Point[]) {
    let minDistance = Number.MAX_SAFE_INTEGER,
        closestLandmark;
    landmarks.forEach(landmark => {
        const distance = calcDistance(curPoint, landmark);
        if (distance < minDistance) {
            minDistance = distance;
            closestLandmark = landmark;
        } else if (distance === minDistance) {
            closestLandmark = null;
        }
    });

    return closestLandmark;
}

function calcDistance(pointA: Point, pointB: Point) {
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

interface Point {
    x: number,
    y: number
}
