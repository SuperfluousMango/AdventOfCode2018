import { inputData } from './data';
import { GameMap } from './GameMap';
import { MobType } from './Mob';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const gameMap = new GameMap(inputData);

    let turn = 0,
        finalTurnCompleted: boolean;

    while (!gameMap.battleIsOver()) {
        finalTurnCompleted = gameMap.processTurn();

        turn++;
        if (turn % 10 === 0) {
            const eCnt = gameMap.mobs.filter(m => m.type === MobType.Elf).length,
                gCnt = gameMap.mobs.length - eCnt;
            console.log(`Finished turn ${turn} (${eCnt} elves/${gCnt} goblins remaining)`);
        }
    }

    const remainingMobHealth = gameMap.mobs.reduce((acc, mob) => acc + mob.healthPoints, 0),
        lastFullTurn = finalTurnCompleted ? turn : turn - 1;
    return remainingMobHealth * lastFullTurn;
}

function puzzleB() {
    let cheaterElfAttackPower = 4, // We know 3 didn't work, so start higher
        gameMap,
        turn,
        finalTurnCompleted;

    while (true) {
        console.log(`Starting new round with elf AP = ${cheaterElfAttackPower}`);
        gameMap = new GameMap(inputData, cheaterElfAttackPower);
        turn = 0;

        let origElfCnt = gameMap.mobs.filter(m => m.type === MobType.Elf).length,
            elvesDied = false;

        while (!elvesDied && !gameMap.battleIsOver()) {
            turn++;
            finalTurnCompleted = gameMap.processTurn();
            elvesDied = gameMap.mobs.filter(m => m.type === MobType.Elf).length < origElfCnt;
        }

        if (!elvesDied) break;
        cheaterElfAttackPower++;
    }

    const remainingMobHealth = gameMap.mobs.reduce((acc, mob) => acc + mob.healthPoints, 0),
        lastFullTurn = finalTurnCompleted ? turn : turn - 1;
    return remainingMobHealth * lastFullTurn;
}
