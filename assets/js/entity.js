function Entity(w, h, x, y, angle, type, id=0) {
  this.type = type;
  this.width = w;
  this.height = h;
  this.hWidth = w / 2;
  this.hHeight = h / 2;
  this.angle = angle;
  this.x = x;
  this.y = y;
  this.z = 0;
  this.prevX=0;
  this.prevY=0;
  this.image = atlas;
  this.alpha = 1;
  this.isSolid = false;
  this.flip=false;
  this.dir=0;//0=R 1=L
  this.id=id;
  this.open=false;
  this.chasePhase = 'none';
  this.attack=false;

  // ATLAS Positions
  this.sx=0;
  this.sy=0;
  this.speed=5;
  this.row=0;
  this.col=0;

  this.move = function(){
    let spd = this.speed;
    this.prevX=this.x;
    this.prevY=this.y;
    let newX=this.x;
    let newY=this.y;

    // 2 Platform levels
    let ct = getTile(this.x - 64, this.y + 32, 1);
    let ct2 = getTile(this.x - 64, this.y + 32, 2);

    if (this.z < -80 && ct2.type === types.TILE2) cart.hero.lvl = 2;
    else if (this.z < -40 && ct.type === types.TILE2) cart.hero.lvl = 1;
    else if (cart.hero.lvl === 2 && ct2.type === types.AIR) cart.hero.lvl = 1;
    else if (cart.hero.lvl === 1 && ct.type === types.AIR) cart.hero.lvl = 0;

    if(left()){
      newX-=spd;
      this.dir=1;
    }

    if(right()){
      newX+=spd;
      this.dir=0;
    }

    if(up()){
      newY-=spd/2;
    }

    if(down()){
      newY+=spd/2;
    }

    this.col = Math.round((newY / 64) + (newX / 128));
    this.row = Math.round((newY / 64) - (newX / 128));

    // Test hit boxes
    cart.blocks.forEach((e) => {
      //console.log("BLOCK: x:" + e.x + " y:" + e.y + " w:" + e.width + " h:" + e.height);
      //console.log("HERO:  x:" + this.x + " y:" + this.y + " w:" + this.width + " h:" + this.height);
      //console.log(e.isCollidingWith(this, true));
    });

    if((this.col >=0 && this.col < 10)&&(this.row >=-1 &&   this.row < 9)){
      this.y=newY;
      this.x=newX;
    }

    if (this.row == -2) {
          if (right()) {
              this.y += spd;
          } else if (up()) {
              this.x -= spd;
          }
      }

      if (this.col == -1) {
          if (left()) {
              this.y += 1;
          } else if (up()) {
              this.x += 1;
          }
      }

      if (this.row == 9) {
          if (left()) {
              this.y -= 1;
          } else if (down()) {
              this.x += 1;
          }
      }

      if (this.col == 10) {
          if (right()) {
              this.y -= 1;
          } else if (down()) {
              this.x -= 1;
          }
      }
  }

  this.setV = function(x,y) {
    this.x=x;
    this.y=y;
  }

  // Render
  this.update = function(delta) {
    this.x = Math.floor(this.x);
    this.Y = Math.floor(this.Y);
    ctx.save();
    ctx.translate(this.x, this.y+this.z);
    if(cart.shakeTime>0){ctx.translate(cart.shake,cart.shake);}
    ctx.globalAlpha = this.alpha;

    img = this.image;
    s   = this.scale;
    hw  = this.hWidth;
    hh  = this.hHeight;
    w   = this.width;
    h   = this.height;

    // Camera Tracking
    ctx.translate(cart.cam.x,cart.cam.y);
    if (this.flip){
      ctx.translate(-w*-w/2,0);
      ctx.scale(-zoom,zoom);
    } else {
      ctx.scale(zoom,zoom);
    }

    ctx.drawImage(img, this.sx, this.sy, w, h, hw, hh, w, h);
    ctx.restore();
  }

  this.isCollidingWith = function(other, isHero) {
    x=other.x;
    y=other.y;
    w=other.width*2;
    h=other.height*2;

    if(isHero){ x-=64 }
  return !(this.x + (this.width*2) < x - w ||
           this.x - (this.width*2) > x + w ||
           this.y + (this.height*2) < y - h ||
           this.y - (this.height*2) > y + h);
};

  this.setType = function(){
    this.alpha = 1;
    this.sy=0;
    this.sx=0;

    switch(this.type){
      case types.HERO:
        break;
      case types.BLOCK:
        this.sx=16;
        this.sy=17;
        break;
      case types.TILE:
        this.sx=16;
        break;
      case types.TILE2:
        this.sx=49;
        break;
      case types.HAND:
        this.sy=17;
        break;
      case types.SHADOW:
        this.sx=5;
        this.sy=17;
        break;
      case types.AIR: // Select blank
        this.sx=89;
        this.sy=50;
        break;

    }

    this.hWidth = this.width / 2;
    this.hHeight = this.height / 2;
  }

  this.setType();
}
