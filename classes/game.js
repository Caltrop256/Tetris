class Game {
    constructor() {
        this.interupt = {
            all: false,
            gameplay: false,
            renderClear: false
        }
        this.gamestate = 0;
        this.gameloops = [...arguments];

        this.loops = {};
        let i = this.gameloops.length;
        while (i-- > 0) this.loops[this.gameloops[i].name] = i;

        this.width = 10;
        this.height = 20;
        this.field = new Uint8ClampedArray(this.width * this.height);
        this.linesToClear = [];
        this.lineClearAnimationTimer = 0;
        this.lineClearAnimationData = new Array(~~(this.width / 2 + 1));
        for (let i = 0; i < this.lineClearAnimationData.length; ++i) {
            this.lineClearAnimationData[i] = 0.9 + (i * 0.1);
        }
        this.offset = {
            x: 96,
            y: 41
        }
        this.tileSize = 8;
        this.tileOffsetSize = 0;

        this.pInputs = {
            horizontal: 0,
            down: false,
            up: false,
            rot: 0,
            swipePosX: 0,
            swipePosY: 0
        }
        this.inputTimer = {
            left: 0,
            right: 0,
            down: 0,
            rot: 0,
            up: 0
        }

        this.gravityTimer = this.setGravity();
        this.currentPiece = -1;
        this.currentRotation = 0;
        this.currentPos = {
            x: ~~(this.width / 2),
            y: -2
        }
        this.nextPiece = ~~(Math.random() * 7);
        this.pieceGraphicConversionTable = [6, 0, 3, 2, 4, 5, 1];
        this.tetrominoRotationTable = [1, 3, 0, 1, 1, 1, 3];
        this.offsetTableX = [-1, 2, -1, -4, -4, -4, 2];
        this.offsetTableY = [2, -1, 2, 1, 3, 3, -1];
        this.dropAmt = 0;
        this.pieceDropAmt = new Array(7).fill(0);
        this.newPiece();

        this.linesCleared = 0;
        this.level = 0;
        this.levelSelected = false;
        this.firstLevelIncReached = false;
        this.firstLevelIncLevel = 0;
        this.selectedLevel = 0;
        this.startingLevel = 0;
        this.success = false;
        this.score = 0;
        this.highscores = {
            A: {
                name: [],
                level: [],
                score: []
            },
            B: {
                name: [],
                level: [],
                score: []
            }
        };

        (this.setHighscoreData = () => {
            const getCookie = (cname) => {
                const name = cname + "=",
                    ca = decodeURIComponent(document.cookie).split(';');
                for (let i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return void 0;
            }

            for (let i = 0; i < 3; ++i) {
                this.highscores.A.name[i] = getCookie('tan' + i);
                this.highscores.A.level[i] = getCookie('tal' + i);
                this.highscores.A.score[i] = getCookie('tas' + i);
                this.highscores.B.name[i] = getCookie('tbn' + i);
                this.highscores.B.level[i] = getCookie('tbl' + i);
                this.highscores.B.score[i] = getCookie('tbs' + i);
            }
        })();

        this.gameOverAnimationTimer = -1337;
        this.gameOverLinePointer = 0;

        this.type = 'A';
        this.junkHeight = 0;

        this.isKeyboard = true;

        this.preferedMusic = 0;
        this.canPlayMusic = false;

        this.frameDelay = 1000 / 60.0988;
        this.__loop(0);
        window.addEventListener('keyup', e => this.__handleKeyboardInput(e, false));
        window.addEventListener('keydown', e => !!this.__handleKeyboardInput(e, true));
        // window.addEventListener('contextmenu', e => e.preventDefault());
        // window.addEventListener('mousemove', e => this.__handleSwipeInput({ x: e.clientX, y: e.clientY, pressing: e.buttons, mobile: false }));
        // window.addEventListener('mousedown', e => this.__handleSwipeInput({ x: e.clientX, y: e.clientY, pressing: e.buttons, mobile: false }));
        // window.addEventListener('mouseup', e => this.__handleSwipeInput({ x: e.clientX, y: e.clientY, pressing: 0, mobile: false }));
        // window.addEventListener('touchstart', e => this.__handleSwipeInput({ x: e.touches[e.touches.length - 1].clientX, y: e.touches[e.touches.length - 1].clientY, pressing: 1, mobile: true }));
        // window.addEventListener('touchend', e => this.__handleSwipeInput({ x: e.changedTouches[e.changedTouches.length - 1].clientX, y: e.changedTouches[e.changedTouches.length - 1].clientY, pressing: 0, mobile: true }));
        // window.addEventListener('touchmove', e => this.__handleSwipeInput({ x: e.touches[e.touches.length - 1].clientX, y: e.touches[e.touches.length - 1].clientY, pressing: 0, mobile: true }))
    }
    updateHighscoreData = () => {
        const setCookie = (name, val, days) => {
            if (typeof val == "undefined") return;
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + val + ";" + expires + ";path=/";
        }, expiry = 365;
        for (let i = 0; i < 3; ++i) {
            setCookie('tan' + i, this.highscores.A.name[i], expiry);
            setCookie('tal' + i, this.highscores.A.level[i], expiry);
            setCookie('tas' + i, this.highscores.A.score[i], expiry);
            setCookie('tbn' + i, this.highscores.B.name[i], expiry);
            setCookie('tbl' + i, this.highscores.B.level[i], expiry);
            setCookie('tbs' + i, this.highscores.B.score[i], expiry);
        }
    }
    startGame = (level, type, height) => {
        this.score = 0;
        this.gameOverAnimationTimer = -1337;
        this.gameOverLinePointer = 0;
        this.linesCleared = 0;
        this.level = level || 0;
        this.startingLevel = this.level;
        this.gravityTimer = this.setGravity();
        this.field = new Uint8ClampedArray(this.width * this.height);
        this.firstLevelIncReached = false;
        this.firstLevelIncLevel = 0;
        this.success = false;
        this.type = type || 'A';
        this.junkHeight = height || 0;
        for (let o in this.interupt) {
            this.interupt[o] = false;
        }
        if (this.type == 'B') {
            this.linesCleared = 25;
        }
        for (let y = 0; y < this.junkHeight * 3; ++y) {
            for (let x = 0; x < this.width; ++x) {
                if (Math.random() > 0.2) this.field[(this.height - y - 1) * this.width + x] = ~~(Math.random() * 3);
            }
        }
        this.setState('playing');
        this.newPiece();
        this.pieceDropAmt = new Array(7).fill(0);
    }
    addScorePoints = n => {
        this.score = Math.min(999999, this.score + n);

    }
    newPiece = () => {
        this.pieceDropAmt[this.currentPiece]++;
        this.currentPiece = this.nextPiece;
        let r = ~~(Math.random() * 8);
        if (r == this.currentPiece || r == this.tetromino.length) {
            r = ~~(Math.random() * 7);
        }
        this.nextPiece = r;
        this.addScorePoints(this.dropAmt);
        this.dropAmt = 0;
        this.currentPos.y = -1;
        this.currentPos.x = ~~(this.width / 2) - ~~(Math.random() * 2 + 1);
        if (window.game && !this.tetromino[this.currentPiece].fits(this.currentPos.x, this.currentPos.y, this.currentRotation)) {
            this.setState('gameover');
        }
    }
    __handleKeyboardInput = (e, u) => {
        this.canPlayMusic = true;
        this.isKeyboard = true;
        switch (e.key.toLowerCase()) {
            case 'a':
            case 'arrowleft':
                this.pInputs.horizontal = +u * -1;
                break;
            case 'd':
            case 'arrowright':
                this.pInputs.horizontal = +u * 1;
                break;
            case 's':
            case 'arrowdown':
                this.pInputs.down = u;
                break;
            case 'w':
            case 'arrowup':
                this.pInputs.up = u;
                break;
            case 'control':
            case 'shift':
            case ' ':
                this.pInputs.rot = +u * 1;
                break;
        }
    }

    /*Unfortunately trying to do fancy mobile controls ended up being an absolute failure, this has been replaced by the MobileControls class!
    
    __handleSwipeInput = (pos) => {
        if (pos.pressing) this.canPlayMusic = true;
        this.isKeyboard = false;
        const rect = canvas.canvas.getBoundingClientRect(),
            rWidth = canvas.w,
            dWidth = rect.width,
            cssMult = rWidth / dWidth,
            cssMultH = canvas.h / rect.height,
            scale = ((pos.x * cssMult) - (this.offset.x + (rect.left * cssMult))) / 80,
            desiredPosition = Math.round(scale * this.width) - 2;

        if (pos.pressing) {
            this.pInputs.swipePosX = (pos.x * cssMult) - (rect.left * cssMult);
            this.pInputs.swipePosY = (pos.y * cssMultH) - (rect.top * cssMultH);
        }

        if (!pos.mobile) {
            if (desiredPosition > game.width + 3 || desiredPosition < -3) return;
            this.pInputs.horizontal = Math.sign(desiredPosition - this.currentPos.x);
            this.pInputs.down = (pos.pressing == 1 || pos.pressing == 3);
            this.pInputs.rot = 1 * +(pos.pressing == 2 || pos.pressing == 3);
        } else {
            if (desiredPosition > game.width + 1) {
                this.pInputs.rot = 1;
            } else if (desiredPosition < -1) {
                this.pInputs.rot = -1;
            } else {
                this.isMobile = true;
                this.mobileTarget = desiredPosition;
                this.pInputs.rot = 0;
            }
            this.pInputs.down = (pos.y * cssMult) - (this.offset.y + (rect.top * cssMult)) - 160 > -1
        }
    }*/

    __loop = (i) => {
        setTimeout(() => this.__loop(++i % 60), this.frameDelay);
        if (this.interupt.all) return;
        if (!this.interupt.renderClear) canvas.im = new ImageData(canvas.w, canvas.h);
        if (this.isMobile) this.pInputs.horizontal = Math.sign(this.mobileTarget - this.currentPos.x);
        if (this.pInputs.horizontal) this.inputTimer[['left', '', 'right'][this.pInputs.horizontal + 1]]++;
        else this.inputTimer.left = (this.inputTimer.right = 0);
        this.inputTimer.down = this.pInputs.down ? this.inputTimer.down + 1 : 0;
        this.inputTimer.up = this.pInputs.up ? this.inputTimer.up + 1 : 0;
        this.inputTimer.rot = this.pInputs.rot ? this.inputTimer.rot + 1 : 0;

        this.gameloops[this.gamestate](i, this, window.sfx);

        this.pInputs.swipePosX = (this.pInputs.swipePosY = 0);
    }
    setGravity = () => {
        if (this.level < 10) {
            return [48, 43, 38, 33, 28, 23, 18, 13, 8, 6][this.level];
        } else if (this.level < 13) {
            return 5;
        } else if (this.level < 16) {
            return 4;
        } else if (this.level < 19) {
            return 3;
        } else if (this.level < 29) {
            return 2;
        } else return 1;
    }
    i2xy = i => ({
        x: i % this.width,
        y: ~~(i / this.width)
    })
    setState = s => {
        if (!this.loops[s] && this.loops[s] !== 0) throw new TypeError('Unknown Game loop! Valid gameloops are "' + Object.keys(this.loops).join('", "') + '"');
        if (this.loops[s + '_prep']) this.gameloops[this.loops[s + '_prep']](this);
        this.gamestate = this.loops[s];
        return this;
    }
    rectangleIntersects = (x0, y0, sx, sy, px, py) => !(px < x0 || px > x0 + sx || py < y0 || py > y0 + sy);
    changeSoundtrack = n => {
        this.preferedMusic = n;
        sfx.stopAllMusic();
        if (n < 3)
            sfx.loop('mus_main' + game.preferedMusic);
    }
}