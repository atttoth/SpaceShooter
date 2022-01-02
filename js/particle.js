class Particle extends PIXI.Sprite {
  constructor (x, y, angle, texture) {
    super(texture);
    this.anchor.set(0.5);
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.time = 0;
    particles.push(this);
    particleContainer.addChild(this);
  }

  linearInterpolation (a, b, i) {
    return i * (b - a) + a;
  }

  update () {
    const time = this.time / 200;
    const distance = this.linearInterpolation(2, 5, time);
    this.x = (this.x) + Math.cos(this.angle) * distance;
    this.y = (this.y) + Math.sin(this.angle) * distance;
  }
}
