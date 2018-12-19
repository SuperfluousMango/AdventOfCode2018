import { opcodeSamples, program } from './data';
import { Opcode, OpcodeProcessor, RegisterState } from './OpcodeProcessor';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const samples = splitSampleData(opcodeSamples);
    return samples.filter(sample => matchSampleToOps(sample).length >= 3).length;
}

function puzzleB() {
    const samples = splitSampleData(opcodeSamples),
        parsedProgram = parseProgram(program),
        opcodeMap = mapOpcodes(samples),
        result = runProgram(parsedProgram, opcodeMap);

    return result[0];
}

function splitSampleData(input: string) {
    const temp = input.split('\n'),
        data: OpcodeSample[] = [];

    while (temp.length) {
        let line = temp.shift();
        if (!line.startsWith('Before:')) continue;
        const initState = parseRegisterStateLine(line);

        line = temp.shift();
        const opcode = parseOpcodeLine(line);

        line = temp.shift();
        const exitState = parseRegisterStateLine(line);

        data.push({ initState, opcode, exitState });
    }

    return data;
}

function parseProgram(input: string) {
    return input.split('\n')
        .map(parseOpcodeLine);
}

function parseRegisterStateLine(line: string) {
    const temp = line.replace(/[^\d,]/g, '')
        .split(',')
        .map(x => parseInt(x));
    return {
        0: temp[0],
        1: temp[1],
        2: temp[2],
        3: temp[3]
    } as RegisterState;
}

function parseOpcodeLine(line: string) {
    const temp = line.split(' ')
        .map(x => parseInt(x));
    return {
        instruction: temp[0],
        paramA: temp[1],
        paramB: temp[2],
        outputRegister: temp[3]
    } as Opcode;
}

function matchSampleToOps(sample: OpcodeSample) {
    const processor = new OpcodeProcessor(),
        ops: OpName[] = [
            'addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori',
            'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'
        ],
        test = sample.exitState;

    let matches: OpName[] = [];
    ops.forEach(opKey => {
        const result = processor[opKey](sample.initState, sample.opcode);
        if (result[0] === test[0] && result[1] === test[1] && result[2] === test[2] && result[3] === test[3]) matches.push(opKey);
    });

    return matches;
}

function mapOpcodes(samples: OpcodeSample[]) {
    const map = new Map<number, OpName[]>();

    for (let x = 0; x < samples.length; x++) {
        const sample = samples[x],
            newMatches = matchSampleToOps(sample),
            oldMatches = map.get(sample.opcode.instruction);

        if (!oldMatches) {
            map.set(sample.opcode.instruction, newMatches);
            continue;
        }

        const filteredMatches = oldMatches.filter(op => newMatches.includes(op));
        map.set(sample.opcode.instruction, filteredMatches);
    }

    const keys = Array.from(map.keys()),
        values = Array.from(map.values());
    let changed;
    do {
        changed = false;
        for (let k = 0; k < keys.length; k++) {
            if (map.get(k).length > 1) continue;

            const opName = map.get(k)[0];
            values.forEach(ops => {
                if (ops.length === 1) return;
                if (ops.includes(opName)) {
                    ops.splice(ops.indexOf(opName), 1);
                    changed = true;
                }
            });
        }
    } while (changed);

    const result = new Map<number, OpName>();
    Array.from(map.keys())
        .sort((a, b) => a - b)
        .forEach(k => result.set(k, map.get(k)[0]));
    return result;
}

function runProgram(program: Opcode[], opcodeMap: Map<number, OpName>) {
    const prog = [...program],
        processor = new OpcodeProcessor();

    let state: RegisterState = { 0: 0, 1: 0, 2: 0, 3: 0 };
    while (prog.length) {
        const opcode = prog.shift(),
            opName = opcodeMap.get(opcode.instruction);
        state = processor[opName](state, opcode);
    }

    return state;
}


interface OpcodeSample {
    initState: RegisterState;
    opcode: Opcode;
    exitState: RegisterState;
}

type OpName = keyof OpcodeProcessor;
