class Canvas {
    constructor(width, height, callback, da) {
        this.ready = false;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        if (!da) document.body.appendChild(this.canvas);

        this.canvas.width = width;
        this.canvas.height = height;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.im = this.ctx.getImageData(0, 0, this.w, this.h);

        this.spritesheetImage = new Image();
        this.spritesheetImage.src = './assets/sprites/spritesheet.png';
        this.spritesheetcanvas = document.createElement('canvas');
        this.spriteData;
        this.ssctx = this.spritesheetcanvas.getContext('2d');
        this.stippleMatrix = [
            [1, 9, 3, 11],
            [13, 5, 15, 7],
            [4, 12, 2, 10],
            [16, 8, 14, 6]
        ];
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                this.stippleMatrix[x][y] /= 17;
            }
        }
        this.spritesheetImage.onload = () => {
            this.spritesheetcanvas.width = this.spritesheetImage.width;
            this.spritesheetcanvas.height = this.spritesheetImage.height;
            this.ssctx.drawImage(this.spritesheetImage, 0, 0);
            this.spriteData = this.ssctx.getImageData(0, 0, this.spritesheetcanvas.width, this.spritesheetcanvas.height).data;
            this.ready = true;
            callback();
        };
    };
    drawTile = (sprX, sprY, sx, sy, px, py) => {
        if (!this.ready) return;
        for (let y = 0; y < sy; ++y) {
            for (let x = 0; x < sx; ++x) {
                let sprI = ((sprY + y) * this.spritesheetcanvas.width + (sprX + x)) * 4,
                    insI = (((py + y) % this.h) * this.w + ((px + x) % this.w)) * 4;

                if (this.spriteData[sprI + 3]) {
                    this.im.data[insI++] = this.spriteData[sprI++];
                    this.im.data[insI++] = this.spriteData[sprI++];
                    this.im.data[insI++] = this.spriteData[sprI++];
                    this.im.data[insI++] = this.spriteData[sprI++];
                }
            }
        }
        this.ctx.putImageData(this.im, 0, 0);
    }
    drawTileOpague = (sprX, sprY, sx, sy, px, py, opacity) => {
        if (!this.ready) return;
        for (let y = 0; y < sy; ++y) {
            for (let x = 0; x < sx; ++x) {
                if (this.stippleMatrix[x % 4][y % 4] < opacity) {
                    let sprI = ((sprY + y) * this.spritesheetcanvas.width + (sprX + x)) * 4,
                        insI = (((py + y) % this.h) * this.w + ((px + x) % this.w)) * 4;

                    this.im.data[insI++] = this.spriteData[sprI++];
                    this.im.data[insI++] = this.spriteData[sprI++];
                    this.im.data[insI++] = this.spriteData[sprI++];
                    this.im.data[insI++] = this.spriteData[sprI++];
                }
            }
        }
        this.ctx.putImageData(this.im, 0, 0);
    }
    write(str, px, py, red) {
        let a = str.toString().split('\n');
        for (let y = 0; y < a.length; ++y) {
            for (let x = 0; x < a[y].length; ++x) {
                const c = a[y][x];
                if (isNaN(c)) {
                    let n = parseInt(c.toLowerCase(), 36) - 10;
                    const tx = n % 15,
                        ty = ~~(n / 15);
                    this.drawTile(tx * 8 + 48, ty * 8, 8, 8, px + (x * 8), py + (y * 8))
                } else {
                    if (c == ' ') continue;
                    let ox = red ? 15 : 0,
                        oy = red ? 10 : 0;
                    this.drawTile(48 + c * 8 + ox, 16 + oy, 8, 8, px + (x * 8), py + (y * 8))
                }
            }
        }
    }
}