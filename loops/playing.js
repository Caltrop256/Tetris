__loop.playing_prep = function playing_prep(game) {
    mobileCTRL.setMenu(false);
    game.changeSoundtrack(game.preferedMusic);
    sfx.play('snd_screenchange');
    game.levelSelected = false;
}

__loop.playing = function playing(t, game) {
    canvas.drawTile(0, 131, canvas.w, canvas.h, 0, 0);
    canvas.drawTile(24, 216 + (game.pieceGraphicConversionTable[game.nextPiece] * 16), 23, 12, 196, 116);
    canvas.write(game.linesCleared.toString().padStart(3, '0'), 152, 16);
    canvas.write(game.level.toString().padStart(2, '0'), 208, 160);
    canvas.write(((game.highscores[game.type].score[0]) || '').toString().padStart(6, '0'), 191, 32);
    canvas.write(game.score.toString().padStart(6, '0'), 191, 56);
    canvas.write(game.type, 24, 24);

    if (!game.interupt.gameplay) {
        if (!game.linesToClear.length) {
            if ((!((game.inputTimer.left - 1) % 8) || !((game.inputTimer.right - 1) % 8)) || (!game.isKeyboard)) {
                if (game.pInputs.horizontal && game.tetromino[game.currentPiece].fits(game.currentPos.x + game.pInputs.horizontal, game.currentPos.y, game.currentRotation)) {
                    game.currentPos.x += game.pInputs.horizontal;
                    sfx.play('snd_move');
                }
            }

            if (game.pInputs.down && !((game.inputTimer.down - 1) % 4) && game.tetromino[game.currentPiece].fits(game.currentPos.x, game.currentPos.y + 1, game.currentRotation)) {
                game.currentPos.y++;
                game.dropAmt++;
            }

            if ((game.inputTimer.rot && game.inputTimer.rot < 2) && game.tetromino[game.currentPiece].fits(game.currentPos.x, game.currentPos.y, game.currentRotation + game.pInputs.rot)) {
                game.currentRotation += game.pInputs.rot;
                if (game.currentRotation > 3) game.currentRotation = 0;
                if (game.currentRotation < 0) game.currentRotation = 4;
                sfx.play('snd_rotate');
            } else if ((game.inputTimer.up && game.inputTimer.up < 2) && game.tetromino[game.currentPiece].fits(game.currentPos.x, game.currentPos.y, game.currentRotation + game.pInputs.up)) {
                game.currentRotation += game.pInputs.up;
                if (game.currentRotation > 3) game.currentRotation = 0;
                if (game.currentRotation < 0) game.currentRotation = 4;
                sfx.play('snd_rotate');
            }

            if (!game.gravitytimer--) {
                game.gravitytimer = game.setGravity();
                if (game.tetromino[game.currentPiece].fits(game.currentPos.x, game.currentPos.y + 1, game.currentRotation)) {
                    game.currentPos.y++;
                } else {
                    sfx.play('snd_land');
                    for (let x = 0; x < 4; ++x) {
                        for (let y = 0; y < 4; ++y) {
                            if (game.tetromino[game.currentPiece].data[Matrix4x4.rotate(x, y, game.currentRotation)]) {
                                const i = (game.currentPos.y + y) * game.width + (game.currentPos.x + x);
                                game.field[i] = game.currentPiece + 1;
                            }
                        }
                    }

                    for (let py = 0; py < 4; ++py) {
                        if (py + game.currentPos.y < game.height) {
                            let isLine = true;
                            for (let px = 0; px < game.width; ++px) {
                                if (!game.field[(game.currentPos.y + py) * game.width + (px)]) {
                                    isLine = false;
                                    break;
                                }
                            }
                            if (isLine) {
                                game.linesToClear.push(game.currentPos.y + py);
                                game.lineClearAnimationtimer = 90;
                            }
                        }
                    }

                    let currentBgMusic = sfx.getCurrentBgMusic(),
                        isAlmostGameOver = false,
                        i = (5 - game.linesToClear.length) * game.width + game.width;
                    while (i-- > 0 && !isAlmostGameOver) {
                        if (game.field[i]) {
                            isAlmostGameOver = true;
                        }
                    };
                    if (isAlmostGameOver && !currentBgMusic.endsWith('_fast')) {
                        sfx.stopAllMusic();
                        sfx.loop('mus_main' + game.preferedMusic + '_fast');
                    } else if (!isAlmostGameOver && currentBgMusic.endsWith('_fast')) {
                        sfx.stopAllMusic();
                        sfx.loop('mus_main' + game.preferedMusic);
                    }

                    if (!game.linesToClear.length) game.newPiece();
                }
            }
        } else {
            if (game.lineClearAnimationtimer == 90) {

                if (game.type == 'A') {
                    game.linesCleared += game.linesToClear.length;
                    const firstLevelIncN = Math.min(game.startingLevel * 10 + 10, Math.max(100, game.startingLevel * 10 - 50));
                    if (game.linesCleared >= firstLevelIncN && game.firstLevelIncReached) {
                        game.firstLevelIncReached = true;
                        game.level++;
                        this.firstLevelIncLevel = game.level;
                        sfx.stopAllSound();
                        sfx.play('snd_levelinc');
                    } else if (game.linesCleared >= firstLevelIncN + ((game.level - game.firstLevelIncLevel) * 10)) {
                        game.level++;
                        sfx.stopAllSound();
                        sfx.play('snd_levelinc');
                    } else {
                        if (game.linesToClear.length < 4) {
                            sfx.play('snd_clearnormal');
                        } else {
                            sfx.play('snd_cleartetris');
                        }
                    }
                } else {
                    game.linesCleared -= game.linesToClear.length;
                    if (game.linesToClear.length < 4) {
                        sfx.play('snd_clearnormal');
                    } else {
                        sfx.play('snd_cleartetris');
                    }
                }
            }
            game.lineClearAnimationtimer--;
            if (!game.lineClearAnimationtimer) {
                game.newPiece();
                for (let i = 0; i < game.linesToClear.length; ++i) {
                    const y = game.linesToClear[i];
                    for (let x = 0; x < game.width; ++x) {
                        game.field[y * game.width + x] = 0;
                        let py = y + 1;
                        while (py-- > 1) {
                            game.field[py * game.width + x] = game.field[(py - 1) * game.width + x];
                            game.field[(py - 1) * game.width + x] = 0;
                        }
                    }
                }

                game.addScorePoints([
                    40 * (game.level + 1),
                    100 * (game.level + 1),
                    300 * (game.level + 1),
                    1200 * (game.level + 1)
                ][game.linesToClear.length - 1])
                game.linesToClear = [];
                for (let i = 0; i < game.lineClearAnimationData.length; ++i) {
                    game.lineClearAnimationData[i] = 0.9 + (i * 0.1);
                }

                if (game.type == 'B' && game.linesCleared <= 0) {
                    game.success = true;
                    game.interupt.gameplay = true;
                    sfx.stopAllSound();
                    sfx.stopAllMusic();
                    sfx.play('snd_success');
                    setTimeout(() => {
                        if (~~game.highscores[game.type].score[2] < game.score) {
                            game.setState('highscore');
                        } else {
                            game.setState('title');
                        }
                    }, 2500)
                }
            }
        }
    } else if (game.success) {
        canvas.drawTile(172, 10, 81, 24, game.offset.x - 1, game.offset.y + game.height / 0.25 - 12);
    }

    if (game.type != 'A') {
        canvas.drawTile(63, 37, 64, 36, 184, 172);
        canvas.write(game.junkHeight, 216, 192);
    }
    for (let i = 0; i < game.pieceDropAmt.length; ++i) {
        canvas.write(game.pieceDropAmt[i].toString().padStart(3, '0'), 47, 87 + (game.pieceGraphicConversionTable[i] * 16), true)
    }

    for (let i = 0; i < game.tetromino.length; ++i) {
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                let px = 24,
                    py = 80 + (game.pieceGraphicConversionTable[i] * 15);
                if (game.tetromino[i].data[Matrix4x4.rotate(x, y, game.tetrominoRotationTable[i])]) {
                    canvas.drawTile(48 + ((i * 5) % (3 * 5)), 27 + (game.level % 9) * 5, 5, 5, px + x * 6 + game.offsetTableX[i], py + y * 6 + game.offsetTableY[i]);
                }
            }
        }
    }
    for (let x = 0; x < 4; ++x) {
        for (let y = 0; y < 4; ++y) {
            if (game.tetromino[game.nextPiece].data[Matrix4x4.rotate(x, y, game.tetrominoRotationTable[game.nextPiece])]) {
                canvas.drawTile(48 + ((game.nextPiece * 5) % (3 * 5)), 27 + (game.level % 9) * 5, 5, 5, 198 + (x * 5) + game.offsetTableX[game.nextPiece], 110 + (y * 5) + game.offsetTableY[game.nextPiece])
            }
        }
    }

    for (let x = 0; x < 4; ++x) {
        for (let y = 0; y < 4; ++y) {
            if (game.tetromino[game.currentPiece].data[Matrix4x4.rotate(x, y, game.currentRotation)] && game.currentPos.y + y >= 0 && !(game.linesToClear.length && game.linesToClear.includes(y + game.currentPos.y))) {
                canvas.drawTile((game.currentPiece * game.tileSize) % (3 * game.tileSize), (game.level % 9) * game.tileSize + (game.level % 9) * game.tileOffsetSize, game.tileSize, game.tileSize, (game.currentPos.x + x) * game.tileSize + game.offset.x, (game.currentPos.y + y) * game.tileSize + game.offset.y);
            }
        }
    }

    let i = game.field.length;
    while (i-- > 0) {
        if (game.field[i]) {
            const p = game.i2xy(i);
            if (game.linesToClear.length && game.linesToClear.includes(p.y)) {
                var opacity;
                if (p.x > ~~(game.width / 2)) {
                    opacity = game.lineClearAnimationData[p.x - ~~(game.width / 2 + 1)];
                } else {
                    opacity = game.lineClearAnimationData[~~(game.width / 2) - p.x];
                }
                if (!(game.lineClearAnimationtimer % 9)) {
                    for (let i = 0; i < game.lineClearAnimationData.length; ++i) {
                        game.lineClearAnimationData[i] -= 0.02;
                    }
                }
                canvas.drawTileOpague(((game.field[i] - 1) * game.tileSize) % (3 * game.tileSize), (game.level % 9) * game.tileSize + (game.level % 9) * game.tileOffsetSize, game.tileSize, game.tileSize, p.x * game.tileSize + game.offset.x, p.y * game.tileSize + game.offset.y, opacity)
            } else canvas.drawTile(((game.field[i] - 1) * game.tileSize) % (3 * game.tileSize), (game.level % 9) * game.tileSize + (game.level % 9) * game.tileOffsetSize, game.tileSize, game.tileSize, p.x * game.tileSize + game.offset.x, p.y * game.tileSize + game.offset.y);
        }
    }
}