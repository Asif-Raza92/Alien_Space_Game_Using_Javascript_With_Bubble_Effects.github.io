const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 5 - 50 ,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    speed: 10,
    color: 'cyan'
};

const game = {
    score: 0,
    level: 1,
    maxLevels: 3,
    lives: 3,
    isGameOver: false,
    enemySpeed: 1,
    enemySpawnRate: 0.02
};

const bullets = [];
const enemies = [];

const keys = {};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 7;
        this.height = 15;
        this.speed = -20;
        this.color = 'green';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.speed = game.enemySpeed;
        this.color = 'red';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

function spawnEnemies() {
    const spawnChance = Math.min(game.enemySpawnRate * game.level, 0.1);
    
    if (Math.random() < spawnChance) {
        const x = Math.random() * (canvas.width - 60);
        enemies.push(new Enemy(x, 0));
    }
}


function checkCollisions() {

    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                game.score += 10 * game.level;
                break;
            }
        }
    }


    for (let i = enemies.length - 1; i >= 0; i--) {
        if (
            player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y
        ) {
            game.lives--;
            enemies.splice(i, 1);
            if (game.lives <= 0) {
                game.isGameOver = true;
            }
        }
    }
}


function shoot() {
    const bulletX = player.x + player.width / 2 - 2.5;
    bullets.push(new Bullet(bulletX, player.y));
}


function drawUI() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${game.score}`, 10, 30);
    ctx.fillText(`Lives: ${game.lives}`, 10, 60);
    ctx.fillText(`Level: ${game.level}`, 10, 90);
}


function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText(`Final Score: ${game.score}`, canvas.width / 2, canvas.height / 2 + 50);
}


function gameLoop() {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    if (game.isGameOver) {
        drawGameOver();
        return;
    }


    movePlayer();
    drawPlayer();


    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].draw();
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }

    spawnEnemies();

    checkCollisions();

    drawUI();

    if (game.score >= game.level * 100) {
        game.level++;
        game.enemySpeed += 0.2;
        game.enemySpawnRate += 0.005;
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && !game.isGameOver) {
        shoot();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function initGame() {
    game.score = 0;
    game.level = 1;
    game.lives = 3;
    game.isGameOver = false;
    gameLoop();
}

initGame();
