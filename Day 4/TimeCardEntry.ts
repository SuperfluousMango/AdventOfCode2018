export class TimeCardEntry {
    public readonly minute: number;

    constructor(
        public readonly guardId: string,
        private readonly h: string,
        private readonly m: string,
        private readonly text: string
    ) {
        this.minute = h === '00' ? parseInt(m) : 0;
    }

    get isShiftStart() {
        return this.text === 'begins shift';
    }
    
    get isSleepStart() {
        return this.text === 'falls asleep';
    }

    get isSleepEnd() {
        return this.text === 'wakes up';
    }
}
