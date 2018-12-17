export class Cart {
    public hasCrashed = false;

    private lastIntersectionStrategy = 0;

    constructor(
        public x: number,
        public y: number,
        public facing: string
    ) { }

    public handleIntersection() {
        let newFacing: string;

        switch (this.lastIntersectionStrategy) {
            case 0:
                // turn left
                newFacing = this.turnLeft();
                break;
            case 1:
                // go straight;
                newFacing = this.facing;
                break;
            case 2:
                // turn right
                newFacing = this.turnRight();
        }

        this.lastIntersectionStrategy = ++this.lastIntersectionStrategy % 3;
        return newFacing;
    }

    public turnLeft() {
        switch (this.facing) {
            case '^':
                return '<';
            case '>':
                return '^';
            case 'v':
                return '>';
            case '<':
                return 'v';
        }
    }

    public turnRight() {
        switch (this.facing) {
            case '^':
                return '>';
            case '>':
                return 'v';
            case 'v':
                return '<';
            case '<':
                return '^';
        }
    }

    public get isVertical() {
        return this.facing === '^' || this.facing === 'v';
    }
}