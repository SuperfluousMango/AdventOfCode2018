import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    // Count box IDs with letters repeated 2 and/or 3 times
    const data = splitData(inputData);

    let duplicateCount = 0,
        triplicateCount = 0;
    
    data.forEach(val => {
        const map = val.split('').reduce((acc, letter) => {
            acc.set(letter, (acc.get(letter) || 0) + 1);
            return acc;
        }, new Map());
        const counts = Array.from(map.values());
        if (counts.some(x => x === 2)) {
            duplicateCount++;
        }
        if (counts.some(x => x === 3)) {
            triplicateCount++;
        }
    });

    return duplicateCount * triplicateCount;
}

function puzzleB() {
    // Find box IDs differing in only a single letter
    const data = splitData(inputData);

    for (let x = 0; x < data.length; x++) {
        for (let y = x + 1; y < data.length; y++) {
            if (idsAreSimilar(data[x], data[y])) {
                return getStringOverlap(data[x], data[y]);
            }
        }
    }
}

function splitData(input: string) {
    return input.split('\n');
}

function idsAreSimilar(a: string, b: string) {
    let hasDiff = false;
    for (let x = 0; x < a.length; x++) {
        if (a[x] === b[x]) continue;
        if (hasDiff) return false;
        hasDiff = true;
    }
    return hasDiff;
}

function getStringOverlap(a: string, b: string) {
    return a.split('')
        .reduce((acc, letter, idx) => letter === b[idx] ? acc + letter : acc, '');
}
