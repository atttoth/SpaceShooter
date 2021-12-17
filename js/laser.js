class Laser extends PIXI.Sprite {
  constructor (isPlayerLaser, x, y, texture, speed) {
    super(texture);
    this.anchor.set(0.5);
    this.isPlayerLaser = isPlayerLaser;
    this.x = x;
    this.y = y;
    this.speed = speed;
    app.stage.addChild(this);
  }

  update () {
    if (this.isPlayerLaser) {
      this.x += this.speed;
      if (this.x > app.view.width * 1.3) {
        app.stage.removeChild(this);
        lasers.splice(this, 1);
      }
    } else {
      this.x -= this.speed;
      if (this.x < app.view.width - app.view.width * 1.3) {
        app.stage.removeChild(this);
        lasers.splice(this, 1);
      }
    }
  }
}
