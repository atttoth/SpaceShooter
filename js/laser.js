class Laser extends PIXI.Sprite {
  constructor (isPlayerLaser, x, y, texture, speed, lifeCycle) {
    super(texture);
    this.anchor.set(0.5);
    this.isPlayerLaser = isPlayerLaser;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.lifeCycle = lifeCycle;
    app.stage.addChild(this);
  }

  update (delta) {
    this.lifeCycle += delta;
    if (this.lifeCycle > 150) {
      lasers.splice(this, 1);
    }
    if (this.isPlayerLaser) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
  }
}
