import { Track } from './Track';
import * as fs from 'fs';

const inputData = fs.readFileSync('./Day 13/data.txt').toString();

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const trackData = new Track(inputData);
    while (true) {
        try {
            trackData.moveCarts();
        } catch (err) {
            return (<Error>err).message;
        }
    }
}

function puzzleB() {
    const trackData = new Track(inputData);
    while (true) {
        try {
            trackData.moveCartsWithCleanup();
        } catch (err) {
            return (<Error>err).message;
        }
    }
}
