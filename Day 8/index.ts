import { inputData } from './data';
import { LicenseNode } from './license-node';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const data = splitData(inputData),
        root = new LicenseNode();
    
    buildTreeData(root, data);

    return root.getMetadataSum();
}

function puzzleB() {
    const data = splitData(inputData),
        root = new LicenseNode();

    buildTreeData(root, data);
    
    return root.getValueSum();
}

function splitData(input: string) {
    return input.split(' ')
        .map(val => parseInt(val));
}

function buildTreeData(parent: LicenseNode, data: number[]) {
    const childCount = data.shift(),
        metadataCount = data.shift();
    
    // Very side-effecty, but effective
    for (let x = 0; x < childCount; x++) {
        const newNode = new LicenseNode();
        parent.addChild(newNode);
        buildTreeData(newNode, data);
    }

    parent.addMetadata(...data.splice(0, metadataCount));
}