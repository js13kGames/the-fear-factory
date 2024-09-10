function Enemy(x, y, w, h, type, index, totalEnemies, dmg) {
  this.active=true;
  this.e = new Entity(w, h, 0, 0, 0, type);

  this.update = function(delta, mobs) {
  }
}

function Spike(x, y, tileID, offset, lvl, pause=0) {
  this.id=tileID;
  this.active=true;
  this.time=offset;
  this.y=y;
  this.x=x;
  this.e = new Entity(10, 14, x, y, 0, types.SPIKE);
  this.hit=false;
  this.level=lvl;
  this.paused=false;

  this.update = function(delta) {
    this.time+=delta;
    this.e.update(delta);
    if(this.time<2.5){
      this.e.height=2;
      this.e.y=this.y+20;
      this.hit=false;
    } else if(this.time<2.55){
      this.hit=true;
      this.e.height=4;
      this.e.y=this.y+12;
    } else if(this.time<2.6){
      this.e.height=8;
      this.e.y=this.y-4;
    } else if(this.time<2.65){
      this.e.height=14;
      this.e.y=this.y-18;
      cart.shakeTime = .06;
      cart.hero.particles.push(new Dusty(this.e.x+15, this.e.y+75+this.e.z));
      cart.hero.particles.push(new Dusty(this.e.x+40, this.e.y+85+this.e.z));
      cart.hero.particles.push(new Dusty(this.e.x+65, this.e.y+75+this.e.z));
    }

    if(this.time>5){
      this.hit=false;
      this.e.height=2;
      if(!this.paused) cart.shakeTime = .04;
      this.paused=true;
      if(this.time>5+pause){
        this.e.y=this.y+16;
        this.time=0;
      }
    } else if(this.time>4.9){
      this.e.height=4;
      this.e.y=this.y+12;
    } else if(this.time>4.8){
      this.e.height=8;
      this.e.y=this.y-4;
    } else if(this.time>4.7){
      this.e.height=14;
      this.e.y=this.y-20;
    }
  }
}

function Ghost(startX, startY, destX, destY) {
  this.active = true;
  this.time = 0;
  this.e = new Entity(13, 15, startX, startY, 0, types.GHOST);
  this.shadow = new Entity(9, 4, 0, 0, 0, types.SHADOW);
  this.shadow.alpha = .4;

  // Movement variables
  this.speed = 30; // Speed of the ghost in pixels per second
  this.startX = startX;
  this.startY = startY;
  this.destX = destX;
  this.destY = destY;
  this.movingToDest = true; // Flag to determine direction of movement

  // Calculate total distance between start and destination
  this.totalDistance = Math.sqrt(Math.pow(destX - startX, 2) + Math.pow(destY - startY, 2));

  // Track progress along the path (0 = at start, 1 = at destination)
  this.progress = 0;

  // Update function to move the ghost
  this.update = function(delta) {
    this.time += delta;
    let bounce =.3 * Math.sin(this.time * 2 * Math.PI * 0.4);
    this.e.z += bounce;
    // Move towards dest
    let direction = this.movingToDest ? 1 : -1;
    this.progress += direction * (this.speed * delta / this.totalDistance);

    // Clamp progress to the range [0, 1]
    if (this.progress >= 1) {
      this.progress = 1;
      this.movingToDest = false; // Reverse direction
    } else if (this.progress <= 0) {
      this.progress = 0;
      this.movingToDest = true; // Move towards destination
    }

    this.e.x = this.startX + (this.destX - this.startX) * this.progress;
    this.e.y = this.startY + (this.destY - this.startY) * this.progress;

    this.shadow.setV(this.e.x + 16, this.e.y + 110);
    this.e.update(delta);
    this.shadow.update(delta);
  };
}





function Key(x, y, level, tileID) {
  this.id=tileID;
  this.active=true;
  this.time=0;
  this.y=y;
  this.x=x;
  this.level=level;
  this.e = new Entity(16, 9, x, y, 0, types.KEY);
  this.shadow = new Entity(9, 4, 0, 0, 0, types.SHADOW);
  this.shadow.alpha=.4;
  this.e.z=level*2;
  this.shadow.z=this.e.z;

  this.update = function(delta) {
    this.time+=delta;
    let bounce =.3 * Math.sin(this.time * 2 * Math.PI * 0.6)
    this.e.z += bounce;
    this.shadow.setV(this.e.x+22, this.e.y+45);
    this.shadow.update(delta);
    this.e.update(delta);
  }
}

function Fire(x, y, l, id) {
  this.active=true;
  this.level=l;
  this.id=id;
  this.hit=true;
  this.time=0;
  this.y=y;
  this.x=x;
  this.e = new Entity(11, 15, x, y, 0, types.FIRE);

  this.update = function(delta) {
    this.time+=delta;
    this.e.update(delta);

    if(this.time>.6){
      this.time=0;
      this.e.sx=0;
    } else if(this.time>.4){
      this.e.sx=23;
    } else if(this.time>.2){
      this.e.sx=12;
    }
  }
}
