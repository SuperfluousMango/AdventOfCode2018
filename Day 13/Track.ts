import { Cart } from "./Cart";

export class Track {
    private layout: string[][];
    private carts: Cart[] = [];

    constructor(private readonly layoutInput: string) {
        const upDownCartSymbols = '^v';
        const leftRightCartSymbols = '<>';

        const temp = layoutInput.split('\n');
        this.layout = temp
            .map((val, yIdx) => {
                return val.split('')
                    .map((xVal, xIdx) => {
                        if (upDownCartSymbols.includes(xVal)) {
                            this.carts.push(new Cart(xIdx, yIdx, xVal));
                            return '|';
                        } else if (leftRightCartSymbols.includes(xVal)) {
                            this.carts.push(new Cart(xIdx, yIdx, xVal));
                            return '-';
                        } else {
                            return xVal;
                        }
                    });
            });
    }

    public moveCarts() {
        this.sortCarts();
        this.carts.forEach(cart => {
            const [newX, newY] = this.getNewPosition(cart);
            if (this.carts.some(val => val.x === newX && val.y === newY)) {
                throw new Error(`Crash at ${newX},${newY}`);
            };

            cart.x = newX;
            cart.y = newY;
            cart.facing = this.getNewFacing(cart, this.layout[newY][newX]);
        });
    }

    public moveCartsWithCleanup() {
        this.sortCarts();
        this.carts.forEach(cart => {
            if (cart.hasCrashed) return; // possible that it was crashed into by a cart earlier in the list

            const [newX, newY] = this.getNewPosition(cart);

            for (let c = 0; c < this.carts.length; c++) {
                if (this.carts[c].hasCrashed) continue;
                if (this.carts[c].x === newX && this.carts[c].y === newY) {
                    cart.hasCrashed = true;
                    this.carts[c].hasCrashed = true;
                    return;
                }
            }

            this.processCartMovement(newX, newY, cart);
        });

        for (let c = this.carts.length - 1; c >= 0; c--) {
            if (this.carts[c].hasCrashed) this.carts.splice(c, 1);
        }

        if (this.carts.length === 1) {
            const cart = this.carts[0];
            throw new Error(`Last cart ended @ ${cart.x},${cart.y}`);
        }
    }

    private sortCarts() {
        this.carts.sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
    }

    private processCartMovement(newX: number, newY: number, cart: Cart) {
        cart.x = newX;
        cart.y = newY;
        cart.facing = this.getNewFacing(cart, this.layout[newY][newX]);
    }

    private getNewPosition(cart: Cart) {
        let newX = cart.x,
            newY = cart.y;

        switch (cart.facing) {
            case '^':
                newY = cart.y - 1;
                break;
            case 'v':
                newY = cart.y + 1;
                break;
            case '<':
                newX = cart.x - 1;
                break;
            case '>':
                newX = cart.x + 1;
                break;
            default:
                throw new Error(`Invalid facing symbol ${cart.facing}`);
        }

        if (newX < 0 || newY < 0 || !this.layout[newY] || !this.layout[newY][newX] || this.layout[newY][newX] === ' ') {
            throw new Error(`Invalid coords "${newX},${newY}" from "${cart.x},${cart.y},${cart.facing},${this.layout[cart.y][cart.x]}"`);
        }

        return [newX, newY];
    }

    private getNewFacing(cart: Cart, newTrack: string) {
        switch (newTrack) {
            case '|':
            case '-':
                return cart.facing;
            case '/':
                return cart.isVertical
                    ? cart.turnRight()
                    : cart.turnLeft();
            case '\\':
                return cart.isVertical
                    ? cart.turnLeft()
                    : cart.turnRight();
            case '+':
                return cart.handleIntersection();
            default:
                throw new Error(`Invalid new track value "${newTrack}" @ ${cart.x},${cart.y},${cart.facing}`);
        }
    }

    private get uncrashedCarts() {
        return this.carts.filter(c => !c.hasCrashed);
    }
}