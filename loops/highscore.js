__loop.highscore_prep = function highscore_prep(game) {
    mobileCTRL.setMenu(true);
    sfx.stopAllMusic();
    sfx.stopAllSound();
    sfx.loop('mus_highscore');
    game.highscoreManagement = {
        namePtr: 0,
        letterIndex: new Array(6).fill(0),
        position: Math.max(game.highscores[game.type].name.length - 1, 0)
    };
    for (let i = 0; i < Math.min(game.highscores[game.type].name.length, 3); ++i) {
        if (game.score >= ~~game.highscores[game.type].score[i]) {
            game.highscoreManagement.position = i;
            break;
        }
    }

    let i = 2;
    while (i-- > game.highscoreManagement.position) {
        game.highscores[game.type].score[i + 1] = game.highscores[game.type].score[i];
        game.highscores[game.type].name[i + 1] = game.highscores[game.type].name[i];
        game.highscores[game.type].level[i + 1] = game.highscores[game.type].level[i];
    }
    game.highscores[game.type].score[game.highscoreManagement.position] = game.score.toString();
    game.highscores[game.type].name[game.highscoreManagement.position] = '      ';
    game.highscores[game.type].level[game.highscoreManagement.position] = game.startingLevel.toString();
}

__loop.highscore = function highscore(t, game) {
    canvas.drawTile(0, 355, canvas.w, canvas.h, 0, 0);
    canvas.ctx.fillStyle = '#000';
    canvas.ctx.fillRect(24, 16, canvas.w - (24 * 2), canvas.h - (16 * 2));
    canvas.ctx.fillRect(26, 24, -3, canvas.h - 48);
    canvas.ctx.fillRect(168, 18, 57, -3);
    canvas.ctx.fillStyle = (game.type == 'A' ? '#D82800' : '#3CBCFC');
    canvas.ctx.fillRect(26, 24, 2, canvas.h - 48);
    canvas.ctx.fillRect(32, canvas.h - 20, canvas.w - 64, 2);
    canvas.ctx.fillRect(canvas.w - 28, 24, 2, canvas.h - 48);
    canvas.ctx.fillRect(32, 18, 57, 2);
    canvas.ctx.fillRect(167, 18, 57, 2);
    canvas.im = canvas.ctx.getImageData(0, 0, canvas.w, canvas.h);
    canvas.drawTile(game.type == 'A' ? 55 : 151, 403, 81, 25, canvas.w / 2 - 41, 7);
    canvas.drawTile(game.type == 'A' ? 55 : 151, 403, 9, 9, 23, 15);
    canvas.drawTile(game.type == 'A' ? 55 : 151, 420, 8, 8, 23, canvas.h - 24);
    canvas.drawTile(game.type == 'A' ? 128 : 224, 403, 8, 9, canvas.w - 32, 15);
    canvas.drawTile(game.type == 'A' ? 128 : 224, 420, 8, 8, canvas.w - 32, canvas.h - 24);

    canvas.write('you are a', 90, 78);
    canvas.write('tetris master.', 75, 92);
    canvas.write('please enter your name', 38, 120);

    canvas.drawTile(0, 582, 171, 67, 40, 134);
    canvas.drawTile(0, 121, 118, 7, 70, 45);

    if (game.pInputs.horizontal && (!((game.inputTimer.left - 1) % 8) || !((game.inputTimer.right - 1) % 8))) {
        let p = game.highscoreManagement.namePtr + game.pInputs.horizontal;
        if (p >= 0 && p <= 5) {
            game.highscoreManagement.namePtr = p;
            sfx.play('snd_selection');
        }
    }

    if (game.pInputs.down && !((game.inputTimer.down - 1) % 8)) {
        game.highscoreManagement.letterIndex[game.highscoreManagement.namePtr]++;
        game.highscoreManagement.letterIndex[game.highscoreManagement.namePtr] %= 27;
        sfx.play('snd_selection');
    }

    if (game.pInputs.up && !((game.inputTimer.up - 1) % 8)) {
        game.highscoreManagement.letterIndex[game.highscoreManagement.namePtr]--;
        if (game.highscoreManagement.letterIndex[game.highscoreManagement.namePtr] < 0)
            game.highscoreManagement.letterIndex[game.highscoreManagement.namePtr] = 26;
        sfx.play('snd_selection');
    }

    game.highscores[game.type].name[game.highscoreManagement.position] = game.highscoreManagement.letterIndex.map(n => String.fromCharCode(n + 64)).join('');

    for (let i = 0; i < game.highscores[game.type].name.length; ++i) {
        if (typeof game.highscores[game.type].name[i] != "undefined")
            canvas.write(game.highscores[game.type].name[i].padEnd(6, ' ') + ' ' + game.highscores[game.type].score[i].padStart(6, '0') + ' ' + game.highscores[game.type].level[i].padStart(2, '0'), 68, 156 + (i * 16));
    }

    if (game.pInputs.rot && (game.inputTimer.rot && game.inputTimer.rot < 2)) {
        game.highscores[game.type].name[game.highscoreManagement.position] = game.highscores[game.type].name[game.highscoreManagement.position].trim();
        sfx.play('snd_screenchange');
        game.updateHighscoreData();
        game.setState('title');
    }

    if ((t % 30) > 15) {
        canvas.ctx.fillStyle = '#fff';
        canvas.ctx.fillRect(69 + game.highscoreManagement.namePtr * 8, 156 + (game.highscoreManagement.position * 16 + 8), 8, 2)
    }
}