// Even more copy/paste (from Day 19) ftw!
// New* and improved** from Day 16!
export class OpcodeProcessor {
    addr(initState: RegisterState, inputs: Opcode) {
        const val = this.add(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    addi(initState: RegisterState, inputs: Opcode) {
        const val = this.add(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.output, val);
    }

    mulr(initState: RegisterState, inputs: Opcode) {
        const val = this.mul(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    muli(initState: RegisterState, inputs: Opcode) {
        const val = this.mul(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.output, val);
    }

    banr(initState: RegisterState, inputs: Opcode) {
        const val = this.ban(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    bani(initState: RegisterState, inputs: Opcode) {
        const val = this.ban(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.output, val);
    }

    borr(initState: RegisterState, inputs: Opcode) {
        const val = this.bor(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    bori(initState: RegisterState, inputs: Opcode) {
        const val = this.bor(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.output, val);
    }

    setr(initState: RegisterState, inputs: Opcode) {
        const val = this.getRegister(initState, inputs.paramA);
        return this.setRegister(initState, inputs.output, val);
    }

    seti(initState: RegisterState, inputs: Opcode) {
        const val = inputs.paramA;
        return this.setRegister(initState, inputs.output, val);
    }

    gtir(initState: RegisterState, inputs: Opcode) {
        const val = this.gt(
            inputs.paramA,
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    gtri(initState: RegisterState, inputs: Opcode) {
        const val = this.gt(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.output, val);
    }

    gtrr(initState: RegisterState, inputs: Opcode) {
        const val = this.gt(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    eqir(initState: RegisterState, inputs: Opcode) {
        const val = this.eq(
            inputs.paramA,
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    eqri(initState: RegisterState, inputs: Opcode) {
        const val = this.eq(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.output, val);
    }

    eqrr(initState: RegisterState, inputs: Opcode) {
        const val = this.eq(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.output, val);
    }

    private add(valA: number, valB: number) {
        return valA + valB;
    }

    private mul(valA: number, valB: number) {
        return valA * valB;
    }

    private ban(valA: number, valB: number) {
        return valA & valB;
    }

    private bor(valA: number, valB: number) {
        return valA | valB;
    }

    private gt(valA: number, valB: number) {
        return valA > valB ? 1 : 0;
    }

    private eq(valA: number, valB: number) {
        return valA === valB ? 1 : 0;
    }

    private getRegister(state: RegisterState, registerNumber: number) {
        switch (registerNumber) {
            case 0: return state[0];
            case 1: return state[1];
            case 2: return state[2];
            case 3: return state[3];
            case 4: return state[4];
            case 5: return state[5];
            default: throw new Error('HALP');
        }
    }

    private setRegister(state: RegisterState, registerNumber: number, val: number) {
        return {
            ...state,
            [registerNumber]: val
        } as RegisterState;
    }
}

export interface Opcode {
    instr: OpName;
    paramA: number;
    paramB: number;
    output: number;
}

export interface RegisterState {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}

export type OpName = keyof OpcodeProcessor;