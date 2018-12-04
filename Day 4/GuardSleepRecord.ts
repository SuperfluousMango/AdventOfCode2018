export class GuardSleepRecord {
    public readonly sleepCountByMinute: Map<number, number> = new Map();

    constructor(public readonly guardId: string) {}

    addSleep(start: number, stop: number) {
        for (let x = start; x < stop; x++) {
            this.sleepCountByMinute.set(x, (this.sleepCountByMinute.get(x) || 0) + 1);
        }
    }

    get totalSleep() {
        return Array.from(this.sleepCountByMinute.values()).reduce((acc, val) => acc + val, 0);
    }

    get sleepiestMinute() {
        const minutes = Array.from(this.sleepCountByMinute);
        let maxCount = 0,
            maxCountMinute = 0;

        for (let x = 0; x < minutes.length; x++) {
            let [minute, count] = minutes[x];
            if (count > maxCount) {
                maxCount = count;
                maxCountMinute = minute;
            }
        }

        return maxCountMinute;
    }
}