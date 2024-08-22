function Hero(w, h, x, y, angle, type) {
  this.e = new Entity(16, 16, 0, 0, 0, types.HERO);
  this.lHand = new Entity(4, 4, 0, 0, 0, types.HAND);
  this.rHand = new Entity(4, 4, 0, 0, 0, types.HAND);
  this.shadow = new Entity(9, 4, 0, 0, 0, types.SHADOW);
  this.shadow.alpha=.4;
  this.handPhase = 0;
  this.hp=100;
  this.maxHP=100;
  this.die=0;
  this.e.gun = new Gun();
  this.currentTile=null;
  this.isJumping = false;
  this.isFalling = false;
  this.jumpSpeed = 0;
  this.gravity = -9; // Gravity to apply during the fall
  this.iJumpSpd = 3; // Initial speed of the jump
  this.jumpHeight = 0; // Current height of the jump
  this.fallHeight = 0;
  this.particles = []; // Array to hold dust particles
  this.dustTimer = 0; // Timer to control dust particle creation
  this.lvl = 0; // Which level of block is the hero; at 0 is ground
  this.prevlvl = 0;

  this.update = function(delta) {
    if (space() && !this.isJumping) {
      this.startJumping();
    }

    // Falling off platform
    if (this.lvl == 0 && this.jumpHeight > 0) {
      this.isJumping = true;
    }

    // Landed on platform 1+
    if (this.lvl > 0 && this.landed()) {
      this.landOnPlatform();
    }

    if (this.isJumping) {
      this.updateJump(delta);
    }

    // Function to start jumping
    this.startJumping = function() {
      this.isJumping = true;
      this.jumpSpeed = this.iJumpSpd;
    }

    // Function to check if the character has landed on platform 1
    this.landed = function() {
      return Math.ceil(this.jumpHeight) < this.getPlatH(this.lvl);
    }

    // Function to handle landing on platform 1
    this.landOnPlatform = function() {
      this.jumpHeight = this.getPlatH(this.lvl);
      this.isFalling = false;
    }

    // Function to update the jumping state
    this.updateJump = function(delta) {
      if (this.lvl == 0 || (this.lvl > 0 && this.jumpHeight > 32)) {
        this.jumpHeight += this.jumpSpeed * delta * 90; // Update jump height
        this.jumpSpeed += this.gravity * delta; // Apply gravity
        this.isFalling = this.jumpSpeed < 0;
      }

      if (this.lvl > 0 && Math.ceil(this.e.z) == this.getPlatH(this.lvl)) {
        this.isJumping = false;
      } else if (this.lvl > 0 && this.landed()) {
        this.isJumping = false;
        this.landOnPlatform();
      }

      // If the character has landed
      if (this.jumpHeight <= 0) {
        this.resetJump();
      }
    }

    // Function to reset jump after landing
    this.resetJump = function() {
      this.jumpHeight = 0;
      this.isJumping = false;
      this.isFalling = false;
      cart.shakeTime = .08;
      hitDust(this.e.x, this.e.y, this.particles);
    }

    this.getPlatH = function(level) {
      const heights = [0, 34.4, 68.8, 103.2];
      return heights[level] || 0;
    }

    // Create dust particles if the hero is moving
    if (mg.keys && (mg.keys[LEFT] || mg.keys[RIGHT] || mg.keys[A] || mg.keys[D])) {
      this.dustTimer += delta;

      if (this.dustTimer > 0.2 && !this.isJumping) {
        this.dustTimer = 0;
        this.particles.push(new Dusty(this.e.x+55, this.e.y+95));
      }
    }

    // Update the character's vertical position based on jumpHeight
    this.e.z = -this.jumpHeight;
    this.lHand.z = -this.jumpHeight;
    this.rHand.z = -this.jumpHeight;
    this.e.move(delta);

    // Facing left or right
    if(mg.keys && (mg.keys[LEFT] || mg.keys[A])){
      this.e.flip=true;
      this.e.dir=1;
    } else if (mg.keys && (mg.keys[RIGHT] || mg.keys[D])){
      this.e.flip=false;
      this.e.dir=0;
    }

    if(this.hp>0){
      // Update the phase, increase by delta time
      this.handPhase += delta;

      // Bouncing Hands
      let bounce = 3 * Math.sin(this.handPhase * 2 * Math.PI * 0.4); // Oscillates with an amplitude of 5 pixels, frequency of 0.5 Hz

      // Hands
      this.lHand.setV(this.e.x+70, this.e.y+64+bounce);
      this.rHand.setV(this.e.x+20, this.e.y+64+bounce);
      this.shadow.setV(this.e.x+(this.e.flip?34:22), this.e.y+80);
      this.shadow.z = this.lvl == 0 ? 0 : -32 * this.lvl; // TODO, fix position based on level


    } else if(this.hp==0){
      if(this.die<1.5){
        this.e.sx=16;
        this.e.width=12;
        this.die+=delta;
        this.e.alpha-=.01;
      } else {
        playSound(5,4);
        cart.reset();
      }
    }

    // Check at centre X
    // y+30 to make sure feet are on tile
    this.currentTile=getTile(this.e.x-64, this.e.y+32, this.lvl)
    // Update and draw dust particles
    this.particles = this.particles.filter(p => p.isAlive());
    this.particles.forEach(p => {
      p.update(delta);
    });

    this.e.update(delta);
    this.lHand.update(delta);
    this.rHand.update(delta);
    this.shadow.update(delta);
    this.e.gun.drawBullets(delta);
  }

  holdClickT = 0;
  this.checkGun = function(){
    if(leftMB) holdClickT += delta;
    if(processClick || leftMB > .25){
      this.e.idle=0;
      ox=ctx.canvas.width/2;
      oy=ctx.canvas.height/2;
      dx = mousePos.x;
      dy = mousePos.y;
      this.e.gun.addBullets(ox,oy,dx,dy, this.e);
      cart.shakeTime=.05;
    }
  }
}
