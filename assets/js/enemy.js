function Enemy(x, y, w, h, type, index, totalEnemies, dmg) {
  this.active=true;
  this.e = new Entity(w, h, 0, 0, 0, type);

  this.update = function(delta, mobs) {
  }
}

function Spike(x, y) {
  this.active=true;
  this.time=0;
  this.y=y;
  this.x=x;
  this.e = new Entity(10, 14, x, y, 0, types.SPIKE);

  this.update = function(delta) {
    this.time+=delta;
    this.e.update(delta);
    if(this.time<2.5){
      this.e.height=2;
      this.e.y=this.y+20;
    } else if(this.time<2.55){
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
      this.e.height=2;
      this.e.y=this.y+16;
      this.time=0
      cart.shakeTime = .04;
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

function Ghost(x, y) {
  this.active=true;
  this.time=0;
  this.y=y;
  this.x=x;
  this.e = new Entity(15, 17, x, y, 0, types.GHOST);
  this.shadow = new Entity(9, 4, 0, 0, 0, types.SHADOW);
  this.shadow.alpha=.4;

  this.update = function(delta) {
    this.time+=delta;
    let bounce =.3 * Math.sin(this.time * 2 * Math.PI * 0.4)
    this.e.z += bounce;
    this.shadow.setV(this.e.x+(this.e.flip?34:22), this.e.y+110);
    this.e.update(delta);
    this.shadow.update(delta);
  }
}

function Key(x, y, level) {
  this.active=true;
  this.time=0;
  this.y=y;
  this.x=x;
  this.level=level;
  this.e = new Entity(16, 9, x, y, 0, types.KEY);
  this.shadow = new Entity(9, 4, 0, 0, 0, types.SHADOW);
  this.shadow.alpha=.4;
  this.e.z=-level*33;
  this.shadow.z=this.e.z;

  this.update = function(delta) {
    this.time+=delta;
    let bounce =.3 * Math.sin(this.time * 2 * Math.PI * 0.6)
    this.e.z += bounce;
    this.shadow.setV(this.e.x+(this.e.flip?34:22), this.e.y+45);
    this.shadow.update(delta);
    this.e.update(delta);
  }
}

function Fire(x, y) {
  this.active=true;
  this.time=0;
  this.y=y;
  this.x=x;
  this.e = new Entity(11, 13, x, y, 0, types.FIRE);

  this.update = function(delta) {
    this.time+=delta;
    this.e.update(delta);

    if(this.time>.6){
      this.time=0;
      this.e.sx=49;
    } else if(this.time>.4){
      this.e.sx=72;
    } else if(this.time>.2){
      this.e.sx=61;
    }
  }
}
