import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    // Sum all frequency changes
    const data = splitData(inputData);
    const sum = data.reduce((acc, val) => acc + val, 0);

    return sum;
}

function puzzleB() {
    // Locate first frequency to repeat while summing frequency changes
    const data = splitData(inputData);
    const set = new Set();

    return findRepeatedFrequency(data, set);
}

function splitData(input: string) {
    return input.split('\n').map(x => parseInt(x));
}

function findRepeatedFrequency(data: number[], set: Set<number>, sum = 0): number {
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
        if (set.has(sum)) {
            return sum;
        }
        set.add(sum);
    }

    // If we didn't find it, loop back to the top of the list and keep going.
    return findRepeatedFrequency(data, set, sum);
}
