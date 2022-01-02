class SpaceShip extends PIXI.Sprite {
  constructor (x, y, texture, hp, speed, isKamikaze) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.speed = speed;
    this.coolDown = 0;
    this.movementTime = 0;
    this.isKamikaze = isKamikaze;
    this.deadSince = 0;
  }

  update () {
    if (this.x > w / 3) {
      this.x -= this.speed;
      this.y += Math.sin(this.movementTime) * 5;
    } else {
      this.x -= this.speed;
    }
    if (this.isKamikaze && this.x <= w / 1.5) {
      this.speed = 7;
      this.x -= this.speed;
    }
  }
}
