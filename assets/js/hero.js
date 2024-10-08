function Hero(w, h, x, y, angle, type) {
  this.e = new Entity(16, 16, 0, 0, 0, types.HERO,this);
  this.lHand = new Entity(4, 4, 0, 0, 0, types.HAND);
  this.rHand = new Entity(4, 4, 0, 0, 0, types.HAND);
  this.shadow = new Entity(9, 4, 0, 0, 0, types.SHADOW);
  this.shadow.alpha=.4;
  this.handPhase = 0;
  this.hp=100;
  this.maxHP=100;
  this.die=0;
  this.curTile=null;
  this.ot=null;
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
  this.hasKey=false;
  this.resetTime=0;
  this.die=false;
  this.fall=false;

  this.update = function(delta) {
    if(this.resetTime>0){
      this.resetTime-=delta
      this.e.alpha-=.01;

      if(this.fall){
        this.e.z+=5;
        this.lHand.z+=4.6;
        this.rHand.z+=4.6;
      } else {
        this.e.z-=10;
        this.lHand.z-=9.6;
        this.rHand.z-=9.6;
        hitDust(this.e.x, this.e.y+this.e.z, this.particles);
      }
    } else if(this.die){
      this.die=false;
      this.fall=false;
      this.resetTime=0;
      this.e.alpha=1;
      cart.resetLvl();
    }

    if(!this.die){
      if (space() && !this.isJumping) {
        this.startJumping();
        mobJump=false;
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
        this.jumpSpeed=0;
        hitDust(this.e.x, this.e.y+this.e.z, this.particles);
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
        const heights = [0, 34.4, 68.8, 103.2, 137.6];
        return heights[level] || 0;
      }

      // Create dust particles if the hero is moving
      if (mg.keys && (mg.keys[LEFT] || mg.keys[RIGHT] || mg.keys[A] || mg.keys[D])) {
        this.dustTimer += delta;

        if (this.dustTimer > 0.2 && !this.isJumping) {
          this.dustTimer = 0;
          this.particles.push(new Dusty(this.e.x+55, this.e.y+95+this.e.z));
        }
      }

      // Update the character's vertical position based on jumpHeight
      this.e.z = -this.jumpHeight;
      let zzz = this.e.z-(this.jumpHeight-(this.lvl*33))/2;
      zzz = zzz < -150?-150:zzz;
      this.lHand.z=zzz;
      this.rHand.z=zzz;
      this.e.move(delta);

      // Facing left or right
      if(mg.keys && (mg.keys[LEFT] || mg.keys[A]) || mobLeft){
        this.e.flip=true;
        this.e.dir=1;
      } else if (mg.keys && (mg.keys[RIGHT] || mg.keys[D]) || mobRight){
        this.e.flip=false;
        this.e.dir=0;
      }
    }

    // Update the phase, increase by delta time
    this.handPhase += delta;

    // Bouncing Hands
    let bounce = 3 * Math.sin(this.handPhase * 2 * Math.PI * 0.4); // Oscillates with an amplitude of 5 pixels, frequency of 0.5 Hz

    // Hands
    this.lHand.setV(this.e.x+70, this.e.y+64+bounce);
    this.rHand.setV(this.e.x+20, this.e.y+64+bounce);
    this.shadow.setV(this.e.x+(this.e.flip?34:22), this.e.y+80);
    this.shadow.z=this.lvl == 0 ? 0 : -34 * this.lvl; // TODO, fix position based on level


    // Check at centre X
    // y+30 to make sure feet are on tile
    this.curTile=getTile(this.e.x-64, this.e.y+32, this.lvl)

    if(this.hasKey&&!shrinking){
      this.lvl=0;
      this.shadow.z=this.e.z;
    }
    // Update and draw dust particles
    this.particles = this.particles.filter(p => p.isAlive());
    this.particles.forEach(p => {
      p.update(delta);
    });

    if(!this.fall){ // Only draw if not falling
      this.draw(delta);
    }

    // Hurt code
    if(this.curTile!=null){
      // FALL
      if((this.curTile.type==types.AIR&&this.curTile.lvl==0&&!this.isJumping&&!this.die)){
        this.resetTime=.6;
        this.fall=true;
        this.die=true;
      }
      this.ot=cart.getLvl().tiles[cart.hero.lvl][this.curTile.id-1];
      if(this.ot != null && this.ot.obj != null){

        switch(this.ot.obj.e.type){
          case types.KEY:
            this.ot.obj=null;
            playSound(COINFX,1);
            this.hasKey=true;
            cart.getLvl().done=true;
            this.clearLevel();
            break;
          case types.SPIKE:
            this.checkHit();
            break;
          case types.FIRE:
            this.checkHit();
            break;
        }
      }
    }
  }

  this.checkHit = function(){
    if(!this.isJumping && this.ot.obj.hit){
      this.startJumping();
      playSound(DIEFX,.8);
      this.resetTime=.6;
      this.die=true;
    }
  }
  this.ghosted = function(){
    this.startJumping();
    playSound(DIEFX,.8);
    this.resetTime=.6;
    this.die=true;
  }
  this.clearLevel = function(){
    cart.levels[cart.cLevel].tiles.forEach((t) => {
      t.forEach((e) => {
        if(e.lvl==0){
          e.type=types.TILE;
        }
        e.obj=null;
        e.setType();
      });
    });
  }

  this.draw = function(delta){
    this.e.update(delta);
    this.lHand.update(delta);
    this.rHand.update(delta);
    this.shadow.update(delta);
  }
}
