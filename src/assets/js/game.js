/* eslint-disable no-undef */
var sprites = {
    ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
    missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
    enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
    enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
    enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
    explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1, }
};

var enemies = null;

function initEnemies(w, h) {
    enemies = {
        straight: {
            x: 0, y: -50, sprite: 'enemy_ship', health: 10,
            E: 100
        },
        ltr: {
            sprite: 'enemy_purple', health: 10,
            x: w / 2 - w / 4,
            y: -43,
            A: 0, B: w / 4, C: 1, D: 0,
            E: 80, F: 0, G: 0, H: 0,
            missiles: 2
        },
        circle: {
            sprite: 'enemy_circle', health: 10,
            x: w / 2 + w / 4 - 32,
            y: -33,
            A: 0, B: -w / 4, C: 1, D: 0,
            E: 20, F: 100, G: 1, H: Math.PI / 2
        },
        wiggle: {
            sprite: 'enemy_bee', health: 20,
            x: 100, y: -50,
            A: 0, B: 50, C: 4, D: 0,
            E: 100,
            firePercentage: 0.001, missiles: 2
        },
        step: {
            sprite: 'enemy_circle', health: 10,
            x: w / 2 - sprites.enemy_circle.w / 2,
            y: -sprites.enemy_circle.h,
            A: 0, B: w / 2 - sprites.enemy_circle.w / 2, C: 1, D: 0,
            E: 75,
        },
        step_left: {
            sprite: 'enemy_circle', health: 10,
            x: w / 4 - sprites.enemy_circle.w / 2,
            y: -sprites.enemy_circle.h,
            A: 0, B: w / 4 - sprites.enemy_circle.w / 2, C: 1, D: 0,
            E: 75,
        },
        step_right: {
            sprite: 'enemy_circle', health: 10,
            x: w / 2 + w / 4 - sprites.enemy_circle.w / 2,
            y: -sprites.enemy_circle.h,
            A: 0, B: w / 4 - sprites.enemy_circle.w / 2, C: 1, D: 0,
            E: 75,
        },
        step_center: {
            sprite: 'enemy_circle', health: 10,
            x: w / 4 + w / 4 - sprites.enemy_circle.w / 2,
            y: -sprites.enemy_circle.h,
            A: 0, B: w / 4 - sprites.enemy_circle.w / 2, C: 1, D: 0,
            E: 75,
        },
    };
}

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

var startGame = function () {
    var ua = navigator.userAgent.toLowerCase();

    // Only 1 row of stars
    if (ua.match(/android/)) {
        Game.setBoard(0, new Starfield(50, 0.6, 100, true));
    } else {
        Game.setBoard(0, new Starfield(20, 0.4, 100, true));
        Game.setBoard(1, new Starfield(50, 0.6, 100));
        Game.setBoard(2, new Starfield(100, 1.0, 50));
    }
    Game.setBoard(3, new TitleScreen("Alien Invasion",
        "Press fire to start playing",
        playGame));
};

var levels = {
    w: 0, h: 0,
    arr: [],
};

function rand(a, b = null) {
    if (b == null) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a + 1));
}

function makeRandomLevelRow(prevEnd = 0, lvlNum = 0) {
    let row = [];
    let sleep = 500 + 100 * rand(0, 3);
    let start = prevEnd + sleep;
    let gap = rand(300, 800);
    const minCount = 3;
    let count = rand(minCount, 1.5 * minCount + 3 + lvlNum);
    let end = start + count * gap;
    let type = '';
    let override = {};
    let generators = [
        () => {
            type = 'step';
            row.push(
                [start, end, gap, type, override],
            );
        },
        () => {
            type = 'step_left';
            row.push(
                [start, end, gap, type, override],
            );
        },
        () => {
            type = 'step_right';
            row.push(
                [start, end, gap, type, override],
            );
        },
        () => {
            type = 'step_center';
            row.push(
                [start, end, gap, type, override],
            );
        },
    ];
    generators[rand(generators.length - 1)]();
    return { sleep, start, end, gap, type, override, row };
}

function makeRandomLevel(lvlNum = 0) {
    let lvl = [];
    let rows = 5 + lvlNum * 2;
    let time = 0;
    for (let i = 0; i < rows; i++) {
        let res = makeRandomLevelRow(time, lvlNum);
        for (let r of res.row) {
            lvl.push(r);
        }
        time = res.end;
    }
    return lvl;
}

function initLevels(w, h) {
    levels.w = w;
    levels.h = h;
    levels.arr.push(makeRandomLevel());
    levels.arr.push([
        // Start,   End, Gap,  Type,   Override
        [0, 4000, 500, 'step'],
        [6000, 13000, 800, 'ltr'],
        [10000, 16000, 400, 'circle'],
        [17800, 20000, 500, 'straight', { x: 3 / 4 * w - 21 }],
        [18200, 20000, 500, 'straight', { x: 3 / 4 * w + 40 - 21 }],
        [18200, 20000, 500, 'straight', { x: 3 / 4 * w - 40 - 21 }],
        [17800, 20000, 500, 'straight', { x: 1 / 4 * w - 21 }],
        [18200, 20000, 500, 'straight', { x: 1 / 4 * w + 40 - 21 }],
        [18200, 20000, 500, 'straight', { x: 1 / 4 * w - 40 - 21 }],
        [22000, 25000, 400, 'wiggle', { x: w / 2 - 25 - 37 / 2 }],
        [22000, 25000, 400, 'wiggle', { x: w / 2 + 25 - 37 / 2 }]
    ]);
}

var LevelTitleScreen = function LevelTitleScreen(lvlNum, callback) {
    var title = `Level ${lvlNum}`;
    var x = -10000;
    var speed = 200;
    var maxSpeed = 400;
    var self = this;
    this.step = function (dt) {
        x += speed * dt;
        speed += 20 * dt;
        speed = Math.min(speed, maxSpeed);
        if (x > Game.width) {
            callback(lvlNum, self);
        }
    };
    this.draw = function (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 40px bangers";
        var measure = ctx.measureText(title);
        if (x < -2 * measure.width) {
            x = -measure.width;
        }
        ctx.fillText(title, x, Game.height / 2);
    };
};

class LevelMaker {
    constructor(board) {
        this.nextState = 'level-title';
        this.lvlNum = 1;
        this.curObj = null;
        this.board = board;
    }
    step() {
        if (this.nextState == 'level-title') {
            this.curObj = new LevelTitleScreen(
                this.lvlNum,
                () => {
                    this.board.remove(this.curObj);
                    this.nextState = 'level';
                    this.step();
                }
            );
            this.board.add(this.curObj);
        } else if (this.nextState == 'level') {
            this.curObj = new Level(
                makeRandomLevel(this.lvlNum),
                () => {
                    this.board.remove(this.curObj);
                    this.nextState = 'level-title';
                    Game.level = this.lvlNum;
                    this.lvlNum += 1;
                    this.step();
                }
            );
            this.board.add(this.curObj);
        }
    }
}

var playGame = function () {
    updateHighPoints(Game.points);
    Game.score = 0;
    Game.level = 0;
    Game.difficulty = 0; // 0, 1 or 2
    var board = new GameBoard();
    board.add(new PlayerShip());
    var lvlMaker = new LevelMaker(board);
    lvlMaker.step();
    Game.setBoard(3, board);
    Game.setBoard(5, new GamePoints(0));
};

var HIGH_POINTS_KEY = "high-points";

function updateHighPoints(points) {
    var highPoints = getHighPoints();
    if (points > highPoints) {
        localStorage.setItem(HIGH_POINTS_KEY, points);
    }
}

function getHighPoints() {
    var highPoints = localStorage.getItem(HIGH_POINTS_KEY) || 0;
    return parseInt(highPoints);
}

var winGame = function () {
    Game.setBoard(3, new TitleScreen("You win!",
        "Press fire to play again",
        playGame));
};

var loseGame = function () {
    app.playSound('explosion1');
    app.addRecord({
        score: Game.score,
        level: Game.level,
    });
    Game.setBoard(
        3,
        new TitleScreen(
            `You complete ${Game.level} levels!`,
            `And got ${Game.score} points!`,
            playGame
        )
    );
};

var Starfield = function (speed, opacity, numStars, clear) {

    // Set up the offscreen canvas
    var stars = document.createElement("canvas");
    stars.width = Game.width;
    stars.height = Game.height;
    var starCtx = stars.getContext("2d");

    var offset = 0;

    // If the clear option is set, 
    // make the background black instead of transparent
    if (clear) {
        starCtx.fillStyle = "#000";
        starCtx.fillRect(0, 0, stars.width, stars.height);
    }

    // Now draw a bunch of random 2 pixel
    // rectangles onto the offscreen canvas
    starCtx.fillStyle = "#FFF";
    starCtx.globalAlpha = opacity;
    for (var i = 0; i < numStars; i++) {
        starCtx.fillRect(Math.floor(Math.random() * stars.width),
            Math.floor(Math.random() * stars.height),
            2,
            2);
    }

    // This method is called every frame
    // to draw the starfield onto the canvas
    this.draw = function (ctx) {
        var intOffset = Math.floor(offset);
        var remaining = stars.height - intOffset;

        // Draw the top half of the starfield
        if (intOffset > 0) {
            ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
        }

        // Draw the bottom half of the starfield
        if (remaining > 0) {
            ctx.drawImage(stars,
                0, 0,
                stars.width, remaining,
                0, intOffset,
                stars.width, remaining);
        }
    };

    // This method is called to update
    // the starfield
    this.step = function (dt) {
        offset += dt * speed;
        offset = offset % stars.height;
    };
};

var PlayerShip = function () {
    this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200, hp: 30, maxHp: 30 });

    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - Game.playerOffset - this.h;

    this.step = function (dt) {
        if (Game.keys['left']) { this.vx = -this.maxVel; }
        else if (Game.keys['right']) { this.vx = this.maxVel; }
        else { this.vx = 0; }

        this.x += this.vx * dt;

        if (this.x < 0) { this.x = 0; }
        else if (this.x > Game.width - this.w) {
            this.x = Game.width - this.w;
        }

        this.reload -= dt;
        if (Game.keys['fire'] && this.reload < 0) {
            app.playSound('fire');
            this.reload = this.reloadTime;

            this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
            this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
        }
    };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function (damage) {
    this.hp -= 10;
    if (this.hp <= 0) {
        if (this.board.remove(this)) {
            loseGame();
        }
    }
};


var PlayerMissile = function (x, y) {
    this.setup('missile', { vy: -700, damage: 10 });
    this.x = x - this.w / 2;
    this.y = y - this.h;
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function (dt) {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_ENEMY);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if (this.y < -this.h) {
        this.board.remove(this);
    }
};


var Enemy = function (blueprint, override) {
    this.merge(this.baseParameters);
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
    this.x0 = this.x;
    this.y0 = this.y;
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = {
    A: 0, B: 0, C: 0, D: 0,
    E: 0, F: 0, G: 0, H: 0,
    t: 0, reloadTime: 0.75,
    reload: 0
};

Enemy.prototype.step = function (dt) {
    this.t += dt;

    // this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    // this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

    if (this.C == 0) {
        this.x = this.x0 + this.t * (this.A + this.B * Math.sin(this.D));
    } else {
        this.x = this.x0 + this.A * this.t - (this.B / this.C) * Math.cos(this.C * this.t + this.D);
    }
    if (this.G == 0) {
        this.y = this.y0 + this.t * (this.E + this.F * Math.sin(this.H));
    } else {
        this.y = this.y0 + this.E * this.t - (this.F / this.G) * Math.cos(this.G * this.t + this.H);
    }

    // this.x += this.vx * dt;
    // this.y += this.vy * dt;

    // console.log(this.sprite, this.x, this.y);

    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    }

    if (Math.random() < 0.01 && this.reload <= 0) {
        this.reload = this.reloadTime;
        if (this.missiles == 2) {
            this.board.add(new EnemyMissile(this.x + this.w - 2, this.y + this.h));
            this.board.add(new EnemyMissile(this.x + 2, this.y + this.h));
        } else {
            this.board.add(new EnemyMissile(this.x + this.w / 2, this.y + this.h));
        }

    }
    this.reload -= dt;

    if (this.y > Game.height ||
        this.x < -Game.width ||
        this.x > 2 * Game.width) {
        this.board.remove(this);
    }
};

Enemy.prototype.hit = function (damage) {
    this.health -= damage;
    if (this.health <= 0) {
        app.playSound('explosion4');
        if (this.board.remove(this)) {
            Game.points += this.points || 100;
            Game.score += this.points || 100;
            this.board.add(new Explosion(this.x + this.w / 2,
                this.y + this.h / 2));
        }
    }
};

var EnemyMissile = function (x, y) {
    this.setup('enemy_missile', { vy: 200, damage: 10 });
    this.x = x - this.w / 2;
    this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function (dt) {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_PLAYER)
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if (this.y > Game.height) {
        this.board.remove(this);
    }
};



var Explosion = function (centerX, centerY) {
    this.setup('explosion', { frame: 0 });
    this.x = centerX - this.w / 2;
    this.y = centerY - this.h / 2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function (dt) {
    this.frame++;
    if (this.frame >= 12) {
        this.board.remove(this);
    }
};

function _startGame() {
    var w = window.innerWidth, h = window.innerHeight;
    initEnemies(w, h);
    initLevels(w, h);
    Game.initialize("game", sprites, startGame);
}
