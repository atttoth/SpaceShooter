
let app;
let player;
const enemies = [];
const keys = {};
let keysDiv;
let seconds = 0;

window.onload = function () {
  app = new PIXI.Application({
    width: 800,
    height: 600
  });
  document.body.appendChild(app.view);

  app.loader.baseUrl = 'sprites';
  app.loader.add('enemy', '../assets/enemyShip.png');
  app.loader.add('player', '../assets/playerShip.png');
  app.loader.onComplete.add(loadingDone);
  app.loader.load();

  window.addEventListener('keydown', (e) => keys[e.keyCode] = true);
  window.addEventListener('keyup', (e) => keys[e.keyCode] = false);

  keysDiv = document.querySelector('#keys');
}
;

class SpaceShip extends PIXI.Sprite {
  constructor (x, y, texture, hp, speed) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.speed = speed;
  }
}

const spawnPlayer = () => {
  player = new SpaceShip(50, app.view.height / 2, app.loader.resources.player.texture, 1, 5);
  app.stage.addChild(player);
};

const spawnEnemy = () => {
  const enemy = new SpaceShip(app.view.width - 50, app.view.height / 2, app.loader.resources.enemy.texture, 1, 4);
  enemies.push(enemy);
  app.stage.addChild(enemy);
};

const loadingDone = () => {
  spawnPlayer();
  app.ticker.add(gameLoop);
};

const gameLoop = (delta) => {
  seconds += (1 / 60) * delta;
  if (seconds >= 2) {
    seconds = 0;
    spawnEnemy();
  }
  if (keys['87']) {
    player.y -= 5;
  }
  if (keys['83']) {
    player.y += 5;
  }
  if (keys['65']) {
    player.x -= 5;
  }
  if (keys['68']) {
    player.x += 5;
  }
};
