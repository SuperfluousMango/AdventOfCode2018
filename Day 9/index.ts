import { Marble } from "./Marble";

const playerCount = 416,
    lastMarbleValue = 71617;

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const scores = playGame(playerCount, lastMarbleValue);
    return Math.max(...scores);
}

function puzzleB() {
    const scores = playGame(playerCount, lastMarbleValue * 100);
    return Math.max(...scores);
}

function playGame(playerCount: number, lastMarbleNum: number) {
    const marbleZero = new Marble(0);
    marbleZero.widdershinsMarble = marbleZero;
    marbleZero.clockwiseMarble = marbleZero;
    
    const scores = Array(playerCount).fill(0);
    let lastScore = 0,
        marbleNum = 0,
        curPlayer = 0,
        curMarble = marbleZero;
    
    // This is the dumbest marble game ever
    while (marbleNum <= lastMarbleNum) {
        marbleNum++;
        if (marbleNum % 23) {
            // Not divisible by 23; place as normal;
            const newMarble = new Marble(marbleNum);
            newMarble.insertAfterMarble(curMarble.clockwiseMarble);
            curMarble = newMarble;
        } else {
            // Divisible by 23; score marbles
            const marbleToRemove = getMarbleToRemove(curMarble);
            lastScore = marbleNum + marbleToRemove.score;
            scores[curPlayer] += lastScore;
            curMarble = marbleToRemove.clockwiseMarble;
            marbleToRemove.deleteMarble();
        }

        curPlayer = (curPlayer + 1) % playerCount;
    }

    return scores;
}

function getMarbleToRemove(curMarble: Marble) {
    // 7 counter-clockwise from current marble
    return curMarble.widdershinsMarble
        .widdershinsMarble
        .widdershinsMarble
        .widdershinsMarble
        .widdershinsMarble
        .widdershinsMarble
        .widdershinsMarble;
}