export class Marble {
    constructor(public score: number) {}

    public clockwiseMarble: Marble;
    public widdershinsMarble: Marble;

    public insertAfterMarble(previousMarble: Marble) {
        // roll your own data structures ftl
        this.clockwiseMarble = previousMarble.clockwiseMarble;
        this.clockwiseMarble.widdershinsMarble = this;
        this.widdershinsMarble = previousMarble;
        previousMarble.clockwiseMarble = this;
    }

    public deleteMarble() {
        this.clockwiseMarble.widdershinsMarble = this.widdershinsMarble;
        this.widdershinsMarble.clockwiseMarble = this.clockwiseMarble;
        this.clockwiseMarble = undefined;
        this.widdershinsMarble = undefined;
    }
}