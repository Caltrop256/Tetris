window.__loop = new class { [Symbol.iterator] = (i = -1, k = Object.keys(this)) => ({ next: () => ({ value: this[k[++i]], done: !(i in k) }) }) }();
__loop.title = function title(t, game) {

    canvas.drawTile(0, 712, 256, 32, 0, 0);
    canvas.drawTile(0, 744, 256, 24, 0, canvas.h - 24);
    canvas.drawTile(256, 0, 23, 224, 0, 0);
    canvas.drawTile(256, 224, 24, 224, canvas.w - 24, 0);
    canvas.drawTile(257, 452, 23, 15, 26, 192);

    canvas.drawTile(0, 650, 206, 62, 26, 40);
    canvas.drawTile(0, 82, 8, 8, 72, 192);
    canvas.drawTile(185, 63, 64, 62, 160, 120);
    canvas.write('2020', 88, 192);
    canvas.write('caltrop', 130, 192);
    if (t >= 30) {
        canvas.write('push start', 55, 152);
    }
    if (game.pInputs.rot && (game.inputTimer.rot && game.inputTimer.rot < 2)) {
        game.setState('menu');
    }

    if (typeof sfx != 'undefined' && !sfx.getCurrentBgMusic()) {
        sfx.loop('mus_title');
    }
}
__loop.title_prep = function title_prep(game) {
    mobileCTRL.setMenu(true);
    if (typeof sfx != "undefined") {
        sfx.stopAllMusic();
        if (game.canPlayMusic) {
            sfx.loop('mus_title');
        }
    }
}