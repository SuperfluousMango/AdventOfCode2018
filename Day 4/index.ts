import { inputData } from './data';
import { TimeCardEntry } from './TimeCardEntry';
import { GuardSleepRecord } from './GuardSleepRecord';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    // Find sleepiest minute for guard with most time asleep
    const timeCardData = splitData(inputData);
    const guardSleepData = buildGuardSleepData(timeCardData);
    const arrayData = Array.from(guardSleepData);
    let maxSleepTime = 0,
        sleepiestGuard;

    for (let x = 0; x < arrayData.length; x++) {
        let [key, guard] = arrayData[x];
        const sleepTime = guard.totalSleep;
        if (sleepTime > maxSleepTime) {
            maxSleepTime = sleepTime;
            sleepiestGuard = guard;
        }
    }

    return parseInt(sleepiestGuard.guardId) * sleepiestGuard.sleepiestMinute;
}

function puzzleB() {
    // Find most-slept minute across all guards and corresponding guard
    const timeCardData = splitData(inputData);
    const guardSleepData = buildGuardSleepData(timeCardData);
    const arrayData = Array.from(guardSleepData);

    let maxSleepCount = 0,
        maxSleepCountMinute,
        sleepiestGuard;
    
    for (let x = 0; x < arrayData.length; x++) {
        let [key, guard] = arrayData[x];
        const sleepiestMinute = guard.sleepiestMinute,
            sleepCount = guard.sleepCountByMinute.get(sleepiestMinute);
        if (sleepCount > maxSleepCount) {
            maxSleepCount = sleepCount;
            maxSleepCountMinute = sleepiestMinute;
            sleepiestGuard = guard;
        }
    }

    return parseInt(sleepiestGuard.guardId) * maxSleepCountMinute;
}

function splitData(input: string) {
    const timeCardEntryRegex = /^\[.+(\d{2}):(\d{2})\]( Guard #(\d+))? (.+)$/;

    return input.split('\n')
        .sort()
        .map(entry => {
            let matches = timeCardEntryRegex.exec(entry);
            let [_, hour, minute, __, guardId, text] = matches;
            return new TimeCardEntry(guardId, hour, minute, text);
        });
}

function buildGuardSleepData(timeCardData: TimeCardEntry[]) {
    const overallSleepData = new Map<string, GuardSleepRecord>();
    let currSleepRecord = new GuardSleepRecord(''),
        sleepStart;

    for (let i = 0; i < timeCardData.length; i++) {
        const entry = timeCardData[i];

        if (entry.isShiftStart) {
            if (sleepStart !== undefined) {
                currSleepRecord.addSleep(sleepStart, 60);
            }

            if (!overallSleepData.has(entry.guardId)) {
                overallSleepData.set(entry.guardId, new GuardSleepRecord(entry.guardId));
            }
            currSleepRecord = overallSleepData.get(entry.guardId);
            sleepStart = undefined;
        } else if (entry.isSleepStart) {
            sleepStart = entry.minute;
        } else if (entry.isSleepEnd) {
            if (sleepStart !== undefined) {
                currSleepRecord.addSleep(sleepStart, entry.minute);
            }
            sleepStart = undefined;
        }
    }

    return overallSleepData;
}
