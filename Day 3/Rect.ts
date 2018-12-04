export class Rect {
    private readonly xEnd: number;
    private readonly yEnd: number;

    constructor(
        public readonly index: number,
        private readonly xStart: number,
        private readonly yStart: number,
        private readonly width: number,
        private readonly height: number
    ) {
        this.xEnd = xStart + width;
        this.yEnd = yStart + height;
    }

    mapBounds(map: Map<string, number>) {
        for (let x = this.xStart; x < this.xEnd; x++) {
            for (let y = this.yStart; y < this.yEnd; y++) {
                const key = `${x},${y}`;
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
    }

    validateBoundsDoNotOverlap(map: Map<string, number>) {
        for (let x = this.xStart; x < this.xEnd; x++) {
            for (let y = this.yStart; y < this.yEnd; y++) {
                const key = `${x},${y}`;
                if ((map.get(key) || 0) > 1) return false;
            }
        }

        return true;
    }
}
