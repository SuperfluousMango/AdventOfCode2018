export class OpcodeProcessor {
    addr(initState: RegisterState, inputs: Opcode) {
        const val = this.add(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    addi(initState: RegisterState, inputs: Opcode) {
        const val = this.add(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    mulr(initState: RegisterState, inputs: Opcode) {
        const val = this.mul(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    muli(initState: RegisterState, inputs: Opcode) {
        const val = this.mul(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    banr(initState: RegisterState, inputs: Opcode) {
        const val = this.ban(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    bani(initState: RegisterState, inputs: Opcode) {
        const val = this.ban(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    borr(initState: RegisterState, inputs: Opcode) {
        const val = this.bor(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    bori(initState: RegisterState, inputs: Opcode) {
        const val = this.bor(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    setr(initState: RegisterState, inputs: Opcode) {
        const val = this.getRegister(initState, inputs.paramA);
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    seti(initState: RegisterState, inputs: Opcode) {
        const val = inputs.paramA;
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    gtir(initState: RegisterState, inputs: Opcode) {
        const val = this.gt(
            inputs.paramA,
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    gtri(initState: RegisterState, inputs: Opcode) {
        const val = this.gt(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    gtrr(initState: RegisterState, inputs: Opcode) {
        const val = this.gt(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    eqir(initState: RegisterState, inputs: Opcode) {
        const val = this.eq(
            inputs.paramA,
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    eqri(initState: RegisterState, inputs: Opcode) {
        const val = this.eq(
            this.getRegister(initState, inputs.paramA),
            inputs.paramB
        );
        return this.setRegister(initState, inputs.outputRegister, val);
    }

    eqrr(initState: RegisterState, inputs: Opcode) {
        const val = this.eq(
            this.getRegister(initState, inputs.paramA),
            this.getRegister(initState, inputs.paramB)
        );
        return this.setRegister(initState, inputs.outputRegister, val);
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
    instruction: number;
    paramA: number;
    paramB: number;
    outputRegister: number;
}

export interface RegisterState {
    0: number;
    1: number;
    2: number;
    3: number;
}
