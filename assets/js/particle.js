function Dusty(x, y) {
  this.x = x;
  this.y = y;
  this.size = 8;  // Initial size of the dust
  this.lifespan = 1; // Lifespan of the dust particle (1 second)

  this.update = function(delta) {
    if (this.lifespan > 0) {
      ctx.save()
      ctx.translate(cart.cam.x, cart.cam.y);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = "rgba(255, 255, 255, " + this.lifespan + ")";
      ctx.fill();
      ctx.restore()
    }

    this.size -= delta * 8;  // Reduce size over time
    this.lifespan -= delta;   // Reduce lifespan over time
  };

  this.isAlive = function() {
    return this.lifespan > 0;
  };
}
