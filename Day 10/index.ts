import { inputData } from './data';
import { Coord } from './Coord';

puzzle().then();

async function puzzle() {
    const data = splitData(inputData);
    let hasShownData = false,
        curSec = 0;

    while (true) {
        data.forEach(coord => coord.processMovement());
        curSec++;

        const minY = data.reduce((acc, val) => val.y < acc ? val.y : acc, Number.MAX_SAFE_INTEGER),
            maxY = data.reduce((acc, val) => val.y > acc ? val.y : acc, Number.MIN_SAFE_INTEGER),
            minX = data.reduce((acc, val) => val.x < acc ? val.x : acc, Number.MAX_SAFE_INTEGER),
            maxX = data.reduce((acc, val) => val.x > acc ? val.x : acc, Number.MIN_SAFE_INTEGER),
            numLines = maxY - minY + 1,
            numCols = maxX - minX + 1;
        
            
        // console.log(minY, maxY, minX, maxX, messageArr.length, messageArr[0].length);
        if (numLines > 20) {
            if (hasShownData) break;
            continue;
        }

        hasShownData = true;

        const messageArr: string[][] = new Array(numLines);
        for (let lineNum = 0; lineNum < numLines; lineNum++) {
            messageArr[lineNum] = new Array(numCols).fill(' ');
        }
        
        data.forEach(coord => {
            messageArr[coord.y - minY][coord.x - minX] = '#';
        });

        console.log(`---------------------------- ${curSec} ----------------------------`);
        messageArr.forEach(line => console.log(line.join('')));

        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 250);
        });
    }
}

async function puzzleB() {
    const data = splitData(inputData);
}

function splitData(input: string) {
    return input.split('\n')
        .map(row => {
            const regex = /^.+<\s?([-0-9]+),\s+([-0-9]+)>.+<\s?([-0-9]+),\s+([-0-9]+)>$/,
                data = regex.exec(row);
            return new Coord(parseInt(data[1]), parseInt(data[2]), parseInt(data[3]), parseInt(data[4]));
        });
}