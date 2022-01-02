class Rocket extends PIXI.Sprite {
  constructor (isPlayerRocket, x, y, texture, speed) {
    super(texture);
    this.anchor.set(0.5);
    this.isPlayerRocket = isPlayerRocket;
    this.x = x;
    this.y = y;
    this.speed = speed;
    rockets.push(this);
    gameObjectContainer.addChild(this);
  }

  update () {
    if (this.isPlayerRocket) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
  }
}
