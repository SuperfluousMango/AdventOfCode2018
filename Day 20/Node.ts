export class Node {
    constructor(
        public x: number,
        public y: number
    ) { }

    public distance: number;

    public connectNorth = false;
    public connectEast = false;
    public connectSouth = false;
    public connectWest = false;

    public addConnection(dir: string) {
        switch (dir) {
            case 'N':
                this.connectNorth = true;
                break;
            case 'E':
                this.connectEast = true;
                break;
            case 'S':
                this.connectSouth = true;
                break;
            case 'W':
                this.connectWest = true;
                break;
        }
    }

    public addConnectionFrom(dir: string) {
        switch (dir) {
            case 'N':
                this.connectSouth = true;
                break;
            case 'E':
                this.connectWest = true;
                break;
            case 'S':
                this.connectNorth = true;
                break;
            case 'W':
                this.connectEast = true;
                break;
        }
    }

    public combineConnections(node: Node) {
        this.connectNorth = this.connectNorth || node.connectNorth;
        this.connectEast = this.connectEast || node.connectEast;
        this.connectSouth = this.connectSouth || node.connectSouth;
        this.connectWest = this.connectWest || node.connectWest;
    }
}
