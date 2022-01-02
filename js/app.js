let app;
const stage = new PIXI.Container();
let player;
let seconds = 0;
const loader = new PIXI.Loader();
const ticker = PIXI.Ticker.shared;

// player input
const keys = {};

// screen width & height
const w = 800;
const h = 600;

// object arrays
const enemies = [];
const rockets = [];
const particles = [];
const explosionTextures = [];
const asteroidTextures = [];

// background
let bgBack;
let bgMiddle;
let bgFront1;
let bgFront2;
let bgX = 0;
const bgSpeed = 1;

// collision detection
const bump = new Bump(PIXI);

// sprite containers
const playerContainer = new PIXI.Container();
const backgroundContainer = new PIXI.Container();
const gameObjectContainer = new PIXI.Container();
const explosionContainer = new PIXI.Container();
const menuBgContainer = new PIXI.Container();
const particleContainer = new PIXI.ParticleContainer(200, {
  position: true
});

// flags
let isTextureLoaded;
let isGameSetUp;
let isGameRunning;

window.onload = () => {
  ticker.add(gameLoop);
  ticker.start();
  imageLoader();
  setTimeout(() => {
    document.getElementById('splash').classList.toggle('fade');
  }, 2000);
  initializeApp('menu-background');
  toggleScreen('menu', true);
};

const imageLoader = () => {
  loader
    .add('menuBg', '../assets/menuBg.png')
    .add('bg1', '../assets/bg1.png')
    .add('bg2', '../assets/bg2.png')
    .add('bg3', '../assets/bg3.png')
    .add('bg4', '../assets/bg4.png')
    .add('enemy', '../assets/enemyShip.png')
    .add('enemyRocket', '../assets/enemyRocket.png')
    .add('player', '../assets/playerShip.png')
    .add('playerRocket', '../assets/playerRocket.png')
    .add('particle', '../assets/particle.png')
    .add('explosion', '../assets/explosionSpritesheet.json')
    .add('asteroid', '../assets/asteroidSpritesheet.json');
  loader.onError.add(() => {
    console.log('Cannot find image');
  });
  loader.onComplete.add(() => {
    menuBgContainer.addChild(new PIXI.Sprite(loader.resources.menuBg.texture));
    fillArrayWithTexture(asteroidTextures, 32, 'a');
    fillArrayWithTexture(explosionTextures, 34, 'e');
    bgBack = createBackground(loader.resources.bg1.texture);
    bgMiddle = createBackground(loader.resources.bg2.texture);
    bgFront1 = createBackground(loader.resources.bg3.texture);
    bgFront2 = createBackground(loader.resources.bg4.texture);
    isTextureLoaded = true;
  });
  loader.load();
};

const initializeApp = (selectedDiv) => {
  app = new PIXI.Renderer({
    view: document.getElementById(selectedDiv)
  });
  document.body.appendChild(app.view);
};

const setupGame = () => {
  toggleScreen('splash', false);
  stage.addChild(backgroundContainer, playerContainer, gameObjectContainer, particleContainer, explosionContainer);
  player = new SpaceShip(50, h / 2, loader.resources.player.texture, 1, 5, false);
  playerContainer.addChild(player);
  window.addEventListener('keydown', (e) => keys[e.keyCode] = true);
  window.addEventListener('keyup', (e) => keys[e.keyCode] = false);
  isGameSetUp = true;
};

// main functions

const startGame = () => {
  if (!isGameSetUp) {
    setupGame();
  }
  initializeApp('game');
  emptyContainer(menuBgContainer);
  isGameRunning = true;
  toggleScreen('menu', false);
  toggleScreen('game', true);
};

const stopGame = () => {
  isGameRunning = false;
  menuBgContainer.addChild(new PIXI.Sprite(loader.resources.menuBg.texture));
  initializeApp('menu-background');
  emptyContainer(gameObjectContainer);
  emptyContainer(explosionContainer);
  emptyContainer(particleContainer);
  emptyArray(enemies);
  emptyArray(rockets);
  emptyArray(particles);
  resetPlayerAndBackground();
  toggleScreen('game', false);
  toggleScreen('menu', true);
};

const exitGame = () => {
  window.location.href = 'https://github.com/atttoth/SpaceShooter.git';
};

// utility functions

const fillArrayWithTexture = (array, numOfTextures, type) => {
  for (let j = 1; j <= numOfTextures; j++) {
    const texture = PIXI.Texture.from(`${type + j}.png`);
    array.push(texture);
  }
};

const resetPlayerAndBackground = () => {
  player.x = 50;
  player.y = h / 2;
  player.hp = 1;
  player.deadSince = 0;
  bgX = 0;
};

const emptyArray = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    array.splice(array[i], 1);
  }
};

const emptyContainer = (container) => {
  for (let i = container.children.length - 1; i >= 0; i--) {
    container.removeChild(container.children[i]);
  }
};

const removeObjectAndSprite = (container, element, array, index) => {
  container.removeChild(element);
  array.splice(index, 1);
};

const toggleScreen = (id, toggle) => {
  const element = document.getElementById(id);
  const display = (toggle) ? 'block' : 'none';
  element.style.display = display;
};

const createBackground = (texture) => {
  const tiling = new PIXI.TilingSprite(texture, w, h);
  tiling.position.set(0, 0);
  backgroundContainer.addChild(tiling);
  return tiling;
};

const isObjectOutOfScreen = (object) => {
  return object.x > w * 1.1 || object.x < w - w * 1.1 || object.y > h * 1.1 || object.y < h - h * 1.1;
};

// update functions

const backgroundUpdate = () => {
  bgX = bgX - bgSpeed;
  bgFront2.tilePosition.x = bgX * 1.2;
  bgFront1.tilePosition.x = bgX;
  bgMiddle.tilePosition.x = bgX / 2;
  bgBack.tilePosition.x = bgX / 4;
};

const playerUpdate = () => {
  if (keys['87'] && player.y - player.height / 2 > 0) { // W
    player.y -= player.speed;
  }
  if (keys['83'] && player.y + player.height / 2 < h) { // S
    player.y += player.speed;
  }
  if (keys['65'] && player.x - player.width / 2 > 0) { // A
    player.x -= player.speed;
  }
  if (keys['68'] && player.x + player.width / 2 < w) { // D
    player.x += player.speed;
  }
  if (keys['32'] && player.coolDown >= 2.1) { // SPACE
    const rocket1 = new Rocket(true, player.x + 50, player.y - 30, loader.resources.playerRocket.texture, 7);
    const rocket2 = new Rocket(true, player.x + 50, player.y + 30, loader.resources.playerRocket.texture, 7);
    player.coolDown = 0;
  }
  if (player.deadSince >= 2.5) {
    stopGame();
  }
};

const rocketUpdate = () => {
  rockets.forEach(l => l.update());
};

const enemyUpdate = (delta) => {
  enemies.forEach(e => {
    e.update();
    e.movementTime += 0.08;
    e.coolDown += (1 / 60) * delta;
    if (e.coolDown >= 1.5 && e.speed <= 1) {
      const rocket = new Rocket(false, e.x - 50, e.y, loader.resources.enemyRocket.texture, 9, 0, 0);
      e.coolDown = 0;
    }
  });
};

const particleUpdate = () => {
  for (let p = particles.length - 1; p >= 0; p--) {
    const particle = particles[p];
    particle.time += 0.1;
    if (isObjectOutOfScreen(particle)) { // particle is out of screen
      removeObjectAndSprite(particleContainer, particle, particles, p);
    }
    particle.update();
  }
};

// constructor functions

const spawnEnemy = () => {
  const enemy = new SpaceShip(w * 1.1, h - (Math.random() * (550 - 150) + 150),
    loader.resources.enemy.texture, 1, 1, Math.random() < 0.5);
  enemies.push(enemy);
  gameObjectContainer.addChild(enemy);
};

const createParticles = (ship) => {
  for (let i = 0; i < 20; i++) {
    const particle = new Particle(ship.x, ship.y, Math.random() * (2 * Math.PI), loader.resources.particle.texture);
  }
};

// animation functions

const animateExplosion = (ship) => {
  const explosion = new PIXI.AnimatedSprite(explosionTextures);
  explosion.anchor.set(0.5);
  explosion.position.set(ship.x, ship.y);
  explosion.animationSpeed = 0.5;
  explosion.loop = false;
  explosion.scale.set(1.2, 1.2);
  explosionContainer.addChild(explosion);
  explosion.play();
  explosion.onComplete = () => {
    explosionContainer.removeChild(explosion);
  };
  createParticles(ship);
};

const animateAsteroid = () => {
  const asteroid = new PIXI.AnimatedSprite(asteroidTextures);
  asteroid.anchor.set(0.5);
  asteroid.position.set(w - w * 1.1, Math.random() * h);
  asteroid.animationSpeed = 0.3;
  asteroid.loop = true;
  asteroid.scale.set(1, 1);
  menuBgContainer.addChild(asteroid);
  asteroid.play();
  asteroid.onFrameChange = () => {
    asteroid.x += 10;
    asteroid.y += 2;
    if (isObjectOutOfScreen(asteroid)) {
      menuBgContainer.removeChild(asteroid);
    }
  };
};

// collision function

const checkCollision = () => {
  for (let r = rockets.length - 1; r >= 0; r--) {
    const rocket = rockets[r];
    let deleteRocket = false;
    if (isObjectOutOfScreen(rocket)) { // rocket is out of screen
      deleteRocket = true;
    }
    if (bump.hit(rocket, player)) { // enemy successfully hit the player
      player.hp -= 1;
      removeObjectAndSprite(gameObjectContainer, rocket, rockets, r);
    }
    for (let e = enemies.length - 1; e >= 0; e--) {
      const enemy = enemies[e];
      if (isObjectOutOfScreen(enemy)) { // enemy is out of screen
        removeObjectAndSprite(gameObjectContainer, enemy, enemies, e);
      }
      if (bump.hit(rocket, enemy) && rocket.isPlayerRocket && enemy.x < w) { // player successfully hit the enemy
        enemy.hp -= 1;
        if (enemy.hp <= 0) {
          animateExplosion(enemy);
          removeObjectAndSprite(gameObjectContainer, enemy, enemies, e);
        }
        deleteRocket = true;
        break;
      }
      if (bump.hit(enemy, player)) { // player and enemy ships collided
        player.hp -= 1;
        animateExplosion(enemy);
        removeObjectAndSprite(gameObjectContainer, enemy, enemies, e);
        break;
      }
    }
    if (deleteRocket) {
      removeObjectAndSprite(gameObjectContainer, rocket, rockets, r);
    }
  }
  if (player.hp <= 0 && player.deadSince === 0) {
    animateExplosion(player);
    player.x = w * 2.1;
  }
};

// game loop function

const gameLoop = (delta) => {
  seconds += (1 / 60) * delta;
  if (isTextureLoaded && !isGameRunning) {
    app.render(menuBgContainer);
    if (seconds >= 1.8) {
      animateAsteroid();
      seconds = 0;
    }
  }
  if (isGameRunning) {
    app.render(stage);
    checkCollision();
    player.coolDown += (1 / 60) * delta;
    if (seconds >= 2) {
      seconds = 0;
      spawnEnemy();
    }
    if (player.hp <= 0) {
      player.deadSince += (1 / 60) * delta;
    }
    enemyUpdate(delta);
    backgroundUpdate();
    particleUpdate();
    playerUpdate();
    rocketUpdate();
  }
};
