class SpaceShip extends PIXI.Sprite {
  constructor (x, y, texture, hp, speed, coolDown, timeSinceLastDirectionChange, direction) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.speed = speed;
    this.coolDown = coolDown;
    this.timeSinceLastDirectionChange = timeSinceLastDirectionChange;
    this.direction = direction;
    app.stage.addChild(this);
  }

  update (delta) {
    this.timeSinceLastDirectionChange += delta;
    if (this.direction % 2 === 0) {
      this.x -= this.speed;
      this.y -= this.speed;
    } else {
      this.x -= this.speed;
      this.y += this.speed;
    }
    if (this.timeSinceLastDirectionChange >= Math.ceil(Math.random() * (300 - 150) + 150)) {
      this.timeSinceLastDirectionChange = 0;
      this.direction = Math.ceil(Math.random() * 2);
    }
    if (this.x < app.view.width - app.view.width * 1.1) {
      enemies.splice(this, 1);
    }
  }
}
