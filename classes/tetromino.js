class Matrix4x4 {
    constructor(input) {
        this.data = [...input[0], ...input[1], ...input[2], ...input[3]];
    }
    fits = (x, y, rot) => {
        for (let px = 0; px < 4; ++px) {
            for (let py = 0; py < 4; ++py) {
                const i = Matrix4x4.rotate(px, py, rot);
                if (this.data[i] && (x + px < 0 || x + px >= game.width || y + py < -1 || y + py >= game.height)) return false;
                const fi = (y + py) * game.width + (x + px);
                if (this.data[i] && game.field[fi]) return false;
            }
        }
        return true;
    }
}

//firefox doesnt support static methods (im serious)
Matrix4x4.rotate = (x, y, rot) => {
    return [
        y * 4 + x,
        12 + y - (x * 4),
        15 - (y * 4) - x,
        3 - y + (x * 4)
    ][rot % 4];
}

Game.prototype.tetromino = [
    new Matrix4x4([
        [0, 0, 1, 0],
        [0, 0, 1, 0], // you are my everything <3
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ]),
    new Matrix4x4([
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ]),
    new Matrix4x4([
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]),
    new Matrix4x4([
        [0, 0, 1, 0],
        [0, 1, 1, 0], // fuck this POS
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]),
    new Matrix4x4([
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ]),
    new Matrix4x4([
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]),
    new Matrix4x4([
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ])
]