import { inputData } from './data';
import { Step } from './Step';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitData(inputData),
        steps = new Map<string, Step>();
    
    data.forEach(val => {
        if (!steps.has(val.prereq)) steps.set(val.prereq, new Step(val.prereq));
        if (!steps.has(val.step)) steps.set(val.step, new Step(val.step));
        steps.get(val.step).addPrereq(steps.get(val.prereq));
    });

    const workList = Array.from(steps.values())
        .filter(step => step.isAvailable);
    let stepOrder = '';
    
    while (workList.length) {
        workList.sort((a, b) => a.id.localeCompare(b.id));
        const curStep = workList.shift();
        curStep.done = true;
        stepOrder += curStep.id;
        curStep.children.forEach(step => { if (step.isAvailable) workList.push(step); });
    }

    console.log(steps.size, stepOrder.length);
    return stepOrder;
}

function puzzleB() {
    const data = splitData(inputData),
        steps = new Map<string, Step>();
    
    data.forEach(val => {
        if (!steps.has(val.prereq)) steps.set(val.prereq, new Step(val.prereq));
        if (!steps.has(val.step)) steps.set(val.step, new Step(val.step));
        steps.get(val.step).addPrereq(steps.get(val.prereq));
    });

    const stepsAvailableToWork = Array.from(steps.values())
        .filter(step => step.isAvailable),
        workItems: WorkItem[] = new Array(5).fill(undefined),
        helpfulTimeConst = 'A'.charCodeAt(0) - 1;
    let timer = -1;

    while (stepsAvailableToWork.length || workItems.some(x => !!x)) {
        timer++;
        for (let x = 0; x < workItems.length; x++) {
            let workItem = workItems[x];
            if (workItem) {
                workItem.timeLeft--;
                if (workItem.timeLeft === 0) {
                    workItem.step.done = true;
                    workItem.step.children.forEach(childStep => { if (childStep.isAvailable) stepsAvailableToWork.push(childStep); });
                    workItems[x] = undefined;
                }
            }

            if (!workItems[x] && stepsAvailableToWork.length) {
                stepsAvailableToWork.sort((a, b) => a.id.localeCompare(b.id));
                const newStep = stepsAvailableToWork.shift();
                workItems[x] = { timeLeft: 60 + newStep.id.charCodeAt(0) - helpfulTimeConst, step: newStep };
            }
        }
    }

    return timer;
}

function splitData(input: string) {
    const regex = /^Step (.) must be finished before step (.).+$/;
    return input.split('\n')
        .map(req => {
            const steps = regex.exec(req);
            return { prereq: steps[1], step: steps[2] } as Requirement;
        });
}

interface Requirement {
    prereq: string;
    step: string;
}

interface WorkItem {
    timeLeft: number;
    step: Step;
}
