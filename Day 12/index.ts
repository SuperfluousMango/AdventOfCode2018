import { initialState, inputData } from './data';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const stateChangeMap = splitInput(inputData);

    let gen = 0,
        padding = 40,
        curState = '.'.repeat(padding)
            + initialState
            + '.'.repeat(padding); // provide padding on either end for future growth

    while (gen < 20) {
        gen++;
        let newState = curState.substr(0, 2);
        for (let pos = 2; pos < curState.length - 2; pos++) {
            newState += (stateChangeMap.get(curState.substr(pos - 2, 5)) || '.');
        }
        newState += curState.substr(-2);
        curState = newState;
    }

    return calcPlantScore(curState, padding);
}

function puzzleB() {
    const stateChangeMap = splitInput(inputData),
        maxGenerations = 50 * 1000 * 1000 * 1000;

    let gen = 0,
        padding = 1000,
        curState = '.'.repeat(padding)
            + initialState
            + '.'.repeat(padding); // provide padding on either end for future growth

    let lastPlantScore = curState.split('')
        .filter(x => x === '#')
        .length,
        lastFewPlantScoreChanges = [lastPlantScore]

    while (gen < maxGenerations) {
        gen++;
        if (gen % 10000 === 0) console.log(gen);
        let newState = curState.substr(0, 2);
        for (let pos = 2; pos < curState.length - 2; pos++) {
            newState += (stateChangeMap.get(curState.substr(pos - 2, 5)) || '.');
        }
        newState += curState.substr(-2);
        curState = newState;
        const newPlantScore = calcPlantScore(curState, padding);
        lastFewPlantScoreChanges.push(newPlantScore - lastPlantScore);
        lastPlantScore = newPlantScore;
        if (lastFewPlantScoreChanges.length > 10) lastFewPlantScoreChanges.shift();

        // Seriously, who has time to wait out 50 billion generations? :(
        if (lastFewPlantScoreChanges.every(x => x === lastFewPlantScoreChanges[0])) {
            console.log(`converged at ${lastFewPlantScoreChanges[0]} per generation at gen ${gen}`);
            return newPlantScore + (maxGenerations - gen) * (lastFewPlantScoreChanges[0]);
        }
    }
}

function splitInput(input: string) {
    return input.split('\n')
        .map(row => row.split(' => '))
        .reduce((acc, [state, result]) => acc.set(state, result), new Map<string, string>());
}

function calcPlantScore(state: string, padding: number) {
    return state.split('')
        .reduce((acc, val, idx) => val === '#' ? (acc.push(idx), acc) : acc, [])
        .reduce((acc, val) => acc + val - padding, 0);
}
