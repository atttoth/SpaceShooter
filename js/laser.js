class Laser extends PIXI.Sprite {
  constructor (x, y, texture, speed) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.speed = speed;
    app.stage.addChild(this);
  }
}
