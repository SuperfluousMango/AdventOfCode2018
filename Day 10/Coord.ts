export class Coord {
    constructor (
        public x: number,
        public y: number,
        public readonly xVel: number,
        public readonly yVel: number
    ) {}

    processMovement() {
        this.x += this.xVel;
        this.y += this.yVel;
    }
}