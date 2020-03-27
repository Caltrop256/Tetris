__loop.gameover_prep = function gameover_prep(game) {
    mobileCTRL.setMenu(false);
    game.interupt.renderClear = true;
    game.gameOverLinePointer = 0;
    game.gameOverAnimationTimer = 180;
    for (let i = 0; i < sfx.audioHolders.length; ++i) {
        sfx.stop(sfx.audioHolders[i].name);
    }
}

__loop.gameover = function gameover(t, game) {
    if (!game.gameOverAnimationTimer) {
        game.interupt.renderClear = false;
        if (~~game.highscores[game.type].score[2] < game.score) {
            game.setState('highscore');
        } else {
            game.setState('title');
        }
    } else {
        game.gameOverAnimationTimer--;
        if (!(game.gameOverAnimationTimer % 5)) {
            game.gameOverLinePointer++;
        }
        if (game.gameOverLinePointer < game.height) {
            for (let i = 0; i < game.width * 2 + 2; ++i) {
                canvas.drawTile(24, (game.level % 9) * game.tileSize, 7, 8, game.offset.x + Math.round((i * (game.tileSize - 1) / 2)) - 1, game.offset.y + game.gameOverLinePointer * (game.tileSize) - 1)
            }
        }
    }
}