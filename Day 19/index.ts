import { inputData } from './data';
import { Opcode, OpcodeProcessor, RegisterState, OpName } from './OpcodeProcessor';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const [ip, program] = splitInput(inputData),
        result = runProgram(ip, program);
    return result[0];
}

function puzzleB() {
    // With the modification, the program calculates the sum of the factors of a great big number.
    // Brute forcing it takes too long, so no reason to run code on it

    // const [ip, program] = splitInput(inputData),
    //     result = runProgram(ip, program, { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    // return result[0];
    return 10982400;
}

function splitInput(input: string): [number, Opcode[]] {
    const data = input.split('\n'),
        instructionPointer = parseInt(data.shift().replace(/\D/g, '')),
        program = data.map(parseOpcodeLine);
    return [instructionPointer, program];
}

function parseOpcodeLine(line: string) {
    const temp = line.split(' ');
    return {
        instr: temp[0] as OpName,
        paramA: parseInt(temp[1]),
        paramB: parseInt(temp[2]),
        output: parseInt(temp[3])
    } as Opcode;
}

function runProgram(ip: number, program: Opcode[], initState?: RegisterState) {
    const processor = new OpcodeProcessor();
    let state: RegisterState = initState || { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let iter = 0;

    while (state[ip] >= 0 && state[ip] < program.length) {
        iter++;

        const opcode = program[state[ip]];
        state = processor[opcode.instr](state, opcode);
        state[ip]++;
    }

    return state;
}

function logState(state: RegisterState) {
    return `${state[0]}, ${state[1]}, ${state[2]}, ${state[3]}, ${state[4]}, ${state[5]}`;
}