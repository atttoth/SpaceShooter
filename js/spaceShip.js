class SpaceShip extends PIXI.Sprite {
  constructor (x, y, texture, hp, speed, coolDown) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.speed = speed;
    this.coolDown = coolDown;
    app.stage.addChild(this);
  }
}
