__loop.menu_prep = function menu_prep(game) {
    mobileCTRL.setMenu(true);
    sfx.stopAllMusic();
    sfx.loop('mus_main' + game.preferedMusic);
    sfx.play('snd_screenchange');
}

__loop.menu = function menu(t, game) {
    canvas.drawTile(0, 355, canvas.w, canvas.h, 0, 0);
    if (((t % 30) > 15) || (game.isKeyboard && (game.pInputs.horizontal || game.pInputs.down || game.pInputs.up))) {
        canvas.drawTile(144, 27, 7, 7, game.type == 'A' ? 63 : 159, 56);
        canvas.drawTile(151, 27, 7, 7, game.type == 'A' ? 122 : 218, 56);

        canvas.drawTile(144, 27, 7, 7, 103, 136 + ((game.preferedMusic) * 16));
        canvas.drawTile(151, 27, 7, 7, 178, 136 + ((game.preferedMusic) * 16));
    }
    if (game.isKeyboard) {
        if (game.pInputs.horizontal > 0 && game.type == 'A') {
            game.type = 'B';
            sfx.play('snd_selection');
        } else if (game.pInputs.horizontal < 0 && game.type == 'B') {
            game.type = 'A';
            sfx.play('snd_selection');
        }

        if (game.pInputs.down && !((game.inputTimer.down - 1) % 8) && game.preferedMusic < 3) {
            sfx.play('snd_selection');
            game.changeSoundtrack(game.preferedMusic + 1);
        }
        else if (game.pInputs.up && !((game.inputTimer.up - 1) % 8) && game.preferedMusic > 0) {
            sfx.play('snd_selection');
            game.changeSoundtrack(game.preferedMusic - 1);
        }

        if (game.pInputs.rot && (game.inputTimer.rot && game.inputTimer.rot < 2)) {
            game.setState('levelselect');
        }
    } else {
        if (game.pInputs.swipePosX) {
            const x = game.pInputs.swipePosX,
                y = game.pInputs.swipePosY;

            if (game.rectangleIntersects(55, 47, 81, 24, x, y)) {
                if (game.type == 'A') game.setState('levelselect');
                else game.type = 'A';
            }
            else if (game.rectangleIntersects(151, 47, 81, 24, x, y)) {
                if (game.type == 'B') game.setState('levelselect');
                else game.type = 'B';
            }
            for (let i = 0; i < 4; ++i) {
                if (game.rectangleIntersects(101, 130 + (i * 16), 87, 18, x, y)) game.changeSoundtrack(i);
            }
        }
    }
}