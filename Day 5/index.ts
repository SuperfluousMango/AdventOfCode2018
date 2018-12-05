import { inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    return fullyReactPolymer(inputData);
}

function puzzleB() {
    const start = 'A'.charCodeAt(0),
        end = 'Z'.charCodeAt(0),
        charMap = new Map<string, number>();

    for (let x = start; x <= end; x++) {
        const curChar = String.fromCharCode(x),
            regex = new RegExp(curChar, 'gi'),
            data = inputData.replace(regex, '');
        charMap.set(curChar, fullyReactPolymer(data));
    }

    return Math.min(...Array.from(charMap.values()));
}

function fullyReactPolymer(input: string) {
    let data = input.split(''),
        newData;

    while (true) {
        newData = reactPolymer(data);
        if (newData.length === data.length) {
            return newData.length;
        }
        data = newData;
    }
}

function reactPolymer(data: string[]) {
    let newData = [];
    for (let x = 0; x < data.length; x++) {
        if (newData.length) {
            const isLower = data[x] === data[x].toLocaleLowerCase(),
                compare = newData[newData.length - 1],
                shouldReact = isLower ? data[x].toLocaleUpperCase() === compare : data[x].toLocaleLowerCase() === compare;
            if (shouldReact) {
                newData.pop();
                continue;
            }
        }
        newData.push(data[x]);
    }
    return newData;
}
