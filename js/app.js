
let app;
let player;
const enemies = [];
const lasers = [];
const keys = {};
let keysDiv;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600
  });

  keysDiv = document.querySelector('#keys').appendChild(app.view);

  app.loader.baseUrl = 'sprites';
  app.loader
    .add('enemy', '../assets/enemyShip.png')
    .add('player', '../assets/playerShip.png')
    .add('playerLaser', '../assets/playerLaser.png');
  app.loader.onComplete.add(loadingDone);
  app.loader.load();

  window.addEventListener('keydown', (e) => keys[e.keyCode] = true);
  window.addEventListener('keyup', (e) => keys[e.keyCode] = false);
}
;

const spawnPlayer = () => {
  player = new SpaceShip(50, app.view.height / 2, app.loader.resources.player.texture, 1, 5, 0);
};

const spawnEnemy = () => {
  const enemy = new SpaceShip(app.view.width - 50, app.view.height / 2, app.loader.resources.enemy.texture, 1, 4, 0);
  enemies.push(enemy);
};

const laserUpdate = (lasers) => {
  lasers.forEach(l => {
    l.x += l.speed;
    if (l.x > app.view.width * 1.1) {
      lasers.splice(l);
    }
  });
};

const detectInput = (delta) => {
  player.coolDown += (1 / 60) * delta;
  if (keys['87']) {
    player.y -= player.speed;
  }
  if (keys['83']) {
    player.y += player.speed;
  }
  if (keys['65']) {
    player.x -= player.speed;
  }
  if (keys['68']) {
    player.x += player.speed;
  }
  if (keys['32'] && player.coolDown >= 1.5 && lasers.length === 0) {
    const laser1 = new Laser(player.x + 50, player.y - 45, app.loader.resources.playerLaser.texture, 7);
    const laser2 = new Laser(player.x + 50, player.y + 45, app.loader.resources.playerLaser.texture, 7);
    lasers.push(laser1, laser2);
    player.coolDown = 0;
  }
};

const loadingDone = () => {
  spawnPlayer();
  app.ticker.add(gameLoop);
};

const gameLoop = (delta) => {
  spawnEnemy();
  detectInput(delta);
  laserUpdate(lasers);
};
