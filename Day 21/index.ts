import { inputData } from './data';
import { OpcodeProcessor, Opcode, RegisterState } from './OpcodeProcessor';
import { OpName } from './OpcodeProcessor';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const [ip, program] = splitInput(inputData);

    return runProgram(ip, program);
}

function puzzleB() {
    const allHaltVals = new Set<number>();

    let r1 = 0,
        r3,
        lastHaltVal;

    do {
        r3 = r1 | 65536;
        r1 = 10905776;

        do {
            r1 += (r3 & 0xFF);
            r1 = r1 & 0xFFFFFF; // Truncate to 24 bits
            r1 *= 65899;
            r1 = r1 & 0xFFFFFF; // Truncate to 24 bits...again
            if (r3 < 256) break;
            r3 = r3 >> 8;
        } while (true);

        if (allHaltVals.has(r1)) break;
        allHaltVals.add(r1);
        lastHaltVal = r1;
    } while (true);

    return lastHaltVal;
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

    while (state[ip] >= 0 && state[ip] < program.length) {
        const opcode = program[state[ip]];
        state = processor[opcode.instr](state, opcode);
        if (state[ip] === 29) break;
        state[ip]++;
    }

    return state[1];
}
