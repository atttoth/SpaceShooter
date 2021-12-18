
let app;
let player;
const enemies = [];
const lasers = [];
const keys = {};
let seconds = 0;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true
  });

  document.querySelector('div#canvas').appendChild(app.view);

  app.loader
    .add('enemy', '../assets/enemyShip.png')
    .add('enemyLaser', '../assets/enemyLaser.png')
    .add('player', '../assets/playerShip.png')
    .add('playerLaser', '../assets/playerLaser.png');
  app.loader.onComplete.add(loadingDone);
  app.loader.load();

  window.addEventListener('keydown', (e) => keys[e.keyCode] = true);
  window.addEventListener('keyup', (e) => keys[e.keyCode] = false);
};

const spawnShip = () => {
  if (!player) {
    player = new SpaceShip(50, app.view.height / 2, app.loader.resources.player.texture, 1, 5, 0, 0, 0);
  }
  const enemy = new SpaceShip(app.view.width * 1.1, app.view.height / 2 + ((Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 150)),
    app.loader.resources.enemy.texture, 1, 1, 0, 0, Math.floor(Math.random() * 2));
  enemies.push(enemy);
};

const playerUpdate = (delta) => {
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
  if (keys['32'] && player.coolDown >= 1.5) {
    const laser1 = new Laser(true, player.x + 40, player.y - 40, app.loader.resources.playerLaser.texture, 7, 0);
    const laser2 = new Laser(true, player.x + 40, player.y + 40, app.loader.resources.playerLaser.texture, 7, 0);
    lasers.push(laser1, laser2);
    player.coolDown = 0;
  }
};

const enemyLaser = (delta) => {
  enemies.forEach(e => {
    e.coolDown += (1 / 60) * delta;
    if (e.coolDown >= 1.5) {
      const laser = new Laser(false, e.x - 50, e.y, app.loader.resources.enemyLaser.texture, 9, 0);
      lasers.push(laser);
      e.coolDown = 0;
    }
  });
};

const laserUpdate = (delta) => {
  lasers.forEach(l => l.update(delta));
};

const enemyUpdate = (delta) => {
  enemies.forEach(e => e.update(delta));
};

const loadingDone = () => {
  spawnShip();
  app.ticker.add(gameLoop);
};

const gameLoop = (delta) => {
  seconds += (1 / 60) * delta;
  if (seconds >= 2) {
    seconds = 0;
    spawnShip();
  }
  enemyLaser(delta);
  playerUpdate(delta);
  enemyUpdate(delta);
  laserUpdate(delta);
};
