__loop.levelselect_prep = function levelselect_prep(game) {
    mobileCTRL.setMenu(true);
    game.selectedLevel = Math.min(game.level, 9);
    game.selectedHeight = Math.min(game.junkHeight, 5);
    game.selectionCooldownTimer = 30;
    sfx.stopAllMusic();
    sfx.play('snd_screenchange');
}

__loop.levelselect = function levelselect(t, game) {
    canvas.drawTile(0, 355, canvas.w, canvas.h, 0, 0);
    canvas.ctx.fillStyle = '#000';
    canvas.ctx.fillRect(24, 16, canvas.w - (24 * 2), canvas.h - (16 * 2));
    canvas.im = canvas.ctx.getImageData(0, 0, canvas.w, canvas.h);

    canvas.drawTile(game.type == 'A' ? 55 : 151, 403, 81, 25, canvas.w / 2 - 41, 7);
    canvas.drawTile(game.type == 'A' ? 55 : 151, 403, 9, 9, 23, 15);
    canvas.drawTile(game.type == 'A' ? 55 : 151, 420, 8, 8, 23, canvas.h - 24);
    canvas.drawTile(game.type == 'A' ? 128 : 224, 403, 8, 9, canvas.w - 32, 15);
    canvas.drawTile(game.type == 'A' ? 128 : 224, 420, 8, 8, canvas.w - 32, canvas.h - 24);

    canvas.ctx.fillRect(26, 24, -3, canvas.h - 48);
    canvas.ctx.fillRect(168, 18, 57, -3);
    canvas.ctx.fillStyle = (game.type == 'A' ? '#D82800' : '#3CBCFC');
    canvas.ctx.fillRect(26, 24, 2, canvas.h - 48);
    canvas.ctx.fillRect(32, canvas.h - 20, canvas.w - 64, 2);
    canvas.ctx.fillRect(canvas.w - 28, 24, 2, canvas.h - 48);
    canvas.ctx.fillRect(32, 18, 57, 2);
    canvas.ctx.fillRect(167, 18, 57, 2);

    canvas.ctx.fillRect(66, 58, 52, 3);
    canvas.ctx.fillRect(66, 61, 3, 17);
    canvas.ctx.fillRect(69, 75, 49, 3);
    canvas.ctx.fillRect(115, 61, 3, 14);

    const x = game.selectedLevel % 5,
        y = ~~(game.selectedLevel / 5);
    canvas.ctx.fillStyle = '#FC9838';
    canvas.ctx.fillRect(52 + x * 16, 83 + y * 16 + y, 16, 16);

    canvas.im = canvas.ctx.getImageData(0, 0, canvas.w, canvas.h);

    canvas.drawTile(171, 0 + (+(game.type == 'A') * 5), 5, 5, 66, 58);
    canvas.drawTile(176, 0 + (+(game.type == 'A') * 5), 5, 5, 113, 58);
    canvas.drawTile(181, 0 + (+(game.type == 'A') * 5), 5, 5, 113, 73);
    canvas.drawTile(186, 0 + (+(game.type == 'A') * 5), 5, 5, 66, 73);
    canvas.write('level', 71, 65);
    canvas.drawTile(48, 80, 83, 35, 51, 82);

    canvas.drawTile(0, 582, 171, 67, 40, 134);
    for (let i = 0; i < game.highscores[game.type].name.length; ++i) {
        if (typeof game.highscores[game.type].name[i] != "undefined" && game.highscores[game.type].name[i])
            canvas.write(game.highscores[game.type].name[i].padEnd(6, ' ') + ' ' + game.highscores[game.type].score[i].padStart(6, '0') + ' ' + game.highscores[game.type].level[i].padStart(2, '0'), 68, 156 + (i * 16));
    }

    if (game.isKeyboard && !game.levelSelected) {
        if (game.pInputs.horizontal && (!((game.inputTimer.left - 1) % 8) || !((game.inputTimer.right - 1) % 8)) && x + game.pInputs.horizontal >= 0 && x + game.pInputs.horizontal <= 4) {
            game.selectedLevel = y * 5 + (x + game.pInputs.horizontal);
            sfx.play('snd_selection');
        }

        if (game.pInputs.down && !y) {
            game.selectedLevel = (y + 1) * 5 + x;
            sfx.play('snd_selection');
        }
        else if (game.pInputs.up && y) {
            game.selectedLevel = (y - 1) * 5 + x;
            sfx.play('snd_selection');
        }

        if (game.pInputs.rot && game.inputTimer.rot && game.inputTimer.rot < 2) {
            game.levelSelected = true;
            sfx.play('snd_selection');
        };
    } else if (!game.isKeyboard && !game.levelSelected) {
        if (game.selectionCooldownTimer) game.selectionCooldownTimer--;
        for (let hx = 0; hx < 5; ++hx) {
            for (let hy = 0; hy < 2; ++hy) {
                if (game.rectangleIntersects(52 + hx * 16, 83 + hy * 16 + hy, 16, 16, game.pInputs.swipePosX, game.pInputs.swipePosY)) {
                    let l = hy * 5 + hx;
                    if (l == game.selectedLevel && !game.selectionCooldownTimer) game.levelSelected = true;
                    else {
                        if (l != game.selectedLevel) game.selectionCooldownTimer = 30;
                        game.selectedLevel = l;
                    }
                }
            }
        }
    } else if (game.type == 'B') {
        const hx = game.selectedHeight % 3,
            hy = ~~(game.selectedHeight / 3);
        canvas.ctx.fillStyle = '#FC9838';
        canvas.ctx.fillRect(156 + hx * 16, 83 + hy * 16 + hy, 16, 16);
        if (game.isKeyboard) {
            if (game.pInputs.horizontal && (!((game.inputTimer.left - 1) % 8) || !((game.inputTimer.right - 1) % 8)) && hx + game.pInputs.horizontal >= 0 && hx + game.pInputs.horizontal <= 2) {
                game.selectedHeight = hy * 3 + (hx + game.pInputs.horizontal);
                sfx.play('snd_selection');
            }

            if (game.pInputs.down && !hy) {
                game.selectedHeight = (hy + 1) * 3 + hx;
                sfx.play('snd_selection');
            }
            else if (game.pInputs.up && hy) {
                game.selectedHeight = (hy - 1) * 3 + hx;
                sfx.play('snd_selection');
            }

            if (game.pInputs.rot && game.inputTimer.rot && game.inputTimer.rot < 2) game.startGame(game.selectedLevel, 'B', game.selectedHeight);
        } else {
            if (game.selectionCooldownTimer) game.selectionCooldownTimer--;
            for (let phx = 0; phx < 5; ++phx) {
                for (let phy = 0; phy < 2; ++phy) {
                    if (game.rectangleIntersects(156 + phx * 16, 83 + phy * 16 + phy, 16, 16, game.pInputs.swipePosX, game.pInputs.swipePosY)) {
                        let l = phy * 3 + phx;
                        if (l == game.selectedHeight && !game.selectionCooldownTimer) game.startGame(game.selectedLevel, 'B', game.selectedHeight)
                        else {
                            if (l != game.selectedHeight) game.selectionCooldownTimer = 30;
                            game.selectedHeight = l;
                            sfx.play('snd_selection');
                        }
                    }
                }
            }
        }
    } else game.startGame(game.selectedLevel, 'A', -1);

    if (game.type == 'B') {
        canvas.ctx.fillStyle = '#3CBCFC';
        canvas.ctx.fillRect(154, 58, 60, 3);
        canvas.ctx.fillRect(154, 61, 3, 17);
        canvas.ctx.fillRect(211, 61, 3, 17);
        canvas.ctx.fillRect(157, 75, 54, 3);
        canvas.im = canvas.ctx.getImageData(0, 0, canvas.w, canvas.h);
        canvas.drawTile(171, 0, 5, 5, 154, 58);
        canvas.drawTile(176, 0, 5, 5, 209, 58);
        canvas.drawTile(181, 0, 5, 5, 209, 73);
        canvas.drawTile(186, 0, 5, 5, 154, 73);
        canvas.write('height', 160, 65);
        canvas.drawTile(132, 80, 51, 35, 155, 82);
    }
}