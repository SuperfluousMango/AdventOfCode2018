export class Step {
    public readonly prereqs: Step[] = [];
    public readonly children: Step[] = [];

    public done: boolean;

    constructor(public id: string) {}

    addPrereq(step: Step) {
        this.prereqs.push(step);
        step.children.push(this);
    }

    get isAvailable() {
        return !this.done && this.prereqs.every(x => x.done);
    }
}