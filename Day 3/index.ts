import { inputData } from './data';
import { Rect } from './Rect';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    // Count # of overlapped square inches
    const boxes = splitData(inputData);
    const claimedArea = new Map();

    boxes.forEach(val => val.mapBounds(claimedArea));
    return Array.from(claimedArea.values())
        .filter(x => x > 1)
        .length;
}

function puzzleB() {
    // Find the one square that doesn't overlap anyone else's square
    const boxes = splitData(inputData);
    const claimedArea = new Map();

    boxes.forEach(val => val.mapBounds(claimedArea));
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].validateBoundsDoNotOverlap(claimedArea)) {
            return boxes[i].index;
        }
    }
}

function splitData(input: string) {
    const rectRegex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/;
    return input.split('\n')
        .map(val => {
            const data = rectRegex.exec(val);
            if (!data || data.length < 5) {
                throw new Error(`Invalid input "${val}"`);
            }
            return new Rect(parseInt(data[1]), parseInt(data[2]), parseInt(data[3]), parseInt(data[4]), parseInt(data[5]));
        });
}
