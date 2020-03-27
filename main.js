const mobileCTRL = new MobileControls(),
    canvas = new Canvas(256, 224, () => {
        window.document.getElementsByTagName('h1')[0].style.display = 'none';
        const defconst = v => ({ configurable: false, writable: false, enumerable: false, value: v });
        Object.defineProperties(window, {
            sfx: defconst(new SoundManager([
                'mus_title',
                'mus_main0',
                'mus_main1',
                'mus_main2',
                'mus_main0_fast',
                'mus_main1_fast',
                'mus_main2_fast',
                'mus_highscore',
                'snd_selection',
                'snd_screenchange',
                'snd_rotate',
                'snd_move',
                'snd_land',
                'snd_levelinc',
                'snd_clearnormal',
                'snd_cleartetris',
                'snd_success'
            ])),
            game: defconst(new Game(...__loop).setState('title'))
        });
        delete __loop;
    }), icon = document.getElementById('favicon'),
    favicon = new Canvas(13 * 8, 11 * 8, (f = () => {
        setTimeout(f, 1000);
        if (typeof game != "undefined") {
            const pieces = [
                [4, 1, -1, 3],
                [2, -1, 1, 0],
                [0, 2, 0, 0],
                [1, 1, 1, 4],
                [5, 0, 2, 3],
                [1, 2, 3, 2],
                [2, 0, 4, 0],
                [5, 2, 5, 3],
                [0, 4, 6, 1],
                [2, 4, 5, 0],
                [3, 3, 3, 1],
                [1, 5, 8, 3],
                [1, 7, 6, 3],
                [1, 4, 0, 2],
                [2, 5, 2, 0],
                [5, 6, 4, 1],
                [4, 6, 1, 0],
                [2, 7, -1, 0],
                [0, 8, 0, 0],
                [6, 7, 2, 0],
                [5, 10, 0, 0],
                [2, 10, 2, 0],
                [4, 9, 4, 0],
                [6, 8, 5, 3]
            ];
            for (let x = 0; x < 4; ++x) {
                for (let y = 0; y < 4; ++y) {
                    for (let i = 0; i < pieces.length; ++i) {
                        const p = pieces[i];
                        if (game.tetromino[p[0]].data[Matrix4x4.rotate(x, y, p[3])])
                            favicon.drawTile((p[0] * game.tileSize) % (3 * game.tileSize), (game.level % 9) * game.tileSize, game.tileSize, game.tileSize, (x * game.tileSize) + (p[1] * game.tileSize), (y * game.tileSize) + ((p[2]) * game.tileSize));
                    }
                }
            }

            icon.href = (favicon.canvas.toDataURL('image/png'))
        };
    }), true);
window.addEventListener('unhandledrejection', e => e.preventDefault());
window.addEventListener('contextmenu', e => e.preventDefault());
//shoutouts to /r/tetris