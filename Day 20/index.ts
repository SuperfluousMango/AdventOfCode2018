import { inputData } from './data';
import { Node } from './Node';

const START_CHAR = '^',
    END_CHAR = '$',
    NORTH_CHAR = 'N',
    EAST_CHAR = 'E',
    SOUTH_CHAR = 'S',
    WEST_CHAR = 'W',
    GROUP_START_CHAR = '(',
    GROUP_END_CHAR = ')',
    OPTION_CHAR = '|';

console.log('Starting...');
console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const map = parseInput(inputData)

    floodMapWithDistance(map);
    return Array.from(map.values())
        .reduce((acc, node) => Math.max(acc, node.distance), Number.MIN_SAFE_INTEGER);
}

function puzzleB() {
    const map = parseInput(inputData)

    floodMapWithDistance(map);
    return Array.from(map.values())
        .filter(node => node.distance >= 1000)
        .length;
}

function parseInput(input: string) {
    const stack: Node[] = [],
        map = new Map<string, Node>(),
        dirAdj = {
            'N': { x: 0, y: -1 },
            'E': { x: 1, y: 0 },
            'S': { x: 0, y: 1 },
            'W': { x: -1, y: 0 }
        };

    let x = 0,
        y = 0,
        curNode = findMapNode(x, y, map);

    for (let c = 0; c < input.length; c++) {
        const char = input[c];

        switch (char) {
            case START_CHAR:
            case END_CHAR:
                continue;
            case NORTH_CHAR:
            case EAST_CHAR:
            case SOUTH_CHAR:
            case WEST_CHAR:
                curNode.addConnection(char);

                x += dirAdj[char].x;
                y += dirAdj[char].y;
                curNode = findMapNode(x, y, map);
                curNode.addConnectionFrom(char);
                break;
            case GROUP_START_CHAR:
                stack.push(curNode);
                break;
            case GROUP_END_CHAR:
                stack.pop();
                break;
            case OPTION_CHAR:
                curNode = stack[stack.length - 1];
                x = curNode.x;
                y = curNode.y;
                break;
        }
    }

    return map;
}

function findMapNode(x: number, y: number, map: Map<string, Node>) {
    const key = `${x},${y}`;
    if (!map.has(key)) {
        map.set(key, new Node(x, y));
    }

    return map.get(key);
}

function buildMap(nodes: Node[]) {
    console.log('Building map...');
    const map = new Map<string, Node>();

    nodes.forEach((node, idx) => {
        if (idx % 1000 === 0) console.log(`Processing node ${idx} of ${nodes.length}`);
        const key = `${node.x},${node.y}`,
            nodeExists = map.has(key);
        if (nodeExists) {
            map.get(key).combineConnections(node);
        } else {
            map.set(key, node);
        }
    });

    return map;
}

function floodMapWithDistance(map: Map<string, Node>) {
    const startNode = map.get('0,0'),
        toProcess = [startNode];

    let distance = 0;
    startNode.distance = distance;

    while (toProcess.length) {
        const node = toProcess.shift(),
            adj = getAdjacentRooms(node, map);
        adj.forEach(n => {
            // Don't process nodes we've already touched
            if (!n.distance) {
                n.distance = node.distance + 1;
                toProcess.push(n);
            }
        });
    }
}

function getAdjacentRooms(node: Node, map: Map<string, Node>) {
    const adj: Node[] = [];
    let key;

    if (node.connectNorth) {
        key = `${node.x},${node.y - 1}`;
        if (map.has(key)) adj.push(map.get(key));
    }

    if (node.connectEast) {
        key = `${node.x + 1},${node.y}`;
        if (map.has(key)) adj.push(map.get(key));
    }

    if (node.connectSouth) {
        key = `${node.x},${node.y + 1}`;
        if (map.has(key)) adj.push(map.get(key));
    }

    if (node.connectWest) {
        key = `${node.x - 1},${node.y}`;
        if (map.has(key)) adj.push(map.get(key));
    }

    return adj;
}

function printMap(map: Map<string, Node>) {
    const WALL_CHAR = '#',
        DOOR_CHAR = '|',
        BOTTOM_DOOR_CHAR = '-',
        ROOM_CHAR = '.',
        START_ROOM_CHAR = 'X',
        nodes = Array.from(map.values())
            .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y),
        nodeXs = nodes.map(node => node.x),
        nodeYs = nodes.map(node => node.y),
        minX = Math.min(...nodeXs),
        maxX = Math.max(...nodeXs),
        minY = Math.min(...nodeYs),
        maxY = Math.max(...nodeYs),
        width = (maxX - minX + 1) * 2 + 1;

    console.log('#'.repeat(width));
    for (let y = minY; y <= maxY; y++) {
        let rowWithRooms = '',
            rowBelowRooms = '';

        for (let x = minX; x <= maxX; x++) {
            const key = `${x},${y}`,
                node = map.get(key) || new Node(x, y);
            rowWithRooms += node.connectWest ? DOOR_CHAR : WALL_CHAR;
            rowWithRooms += x === 0 && y === 0 ? START_ROOM_CHAR : ROOM_CHAR;

            rowBelowRooms += WALL_CHAR;
            rowBelowRooms += node.connectSouth ? BOTTOM_DOOR_CHAR : WALL_CHAR;
        }

        rowWithRooms += WALL_CHAR;
        rowBelowRooms += WALL_CHAR;

        console.log(rowWithRooms);
        console.log(rowBelowRooms);
    }
}
