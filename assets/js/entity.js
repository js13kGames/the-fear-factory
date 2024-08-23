function Entity(w, h, x, y, angle, type, id=0, p=null) {
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
  this.parent=p;
  this.closeTiles=[];

  // ATLAS Positions
  this.sx=0;
  this.sy=0;
  this.speed=5;
  this.row=0;
  this.col=0;

  // ONLY FOR THE HERO]
  // Move out of entity
  this.move = function(){
    let spd = this.speed;
    this.prevX=this.x;
    this.prevY=this.y;
    let newX=this.x;
    let newY=this.y;

    // Get the surrounding tiles
    this.closeTiles=[];
    this.col=Math.round((this.y/64)+(this.x/128));
    this.row=Math.round((this.y/64)-(this.x/128))+1;
    let o=[1,10,11],t=cart.hero.currentTile?.id;
    let i=(this.row*10)+this.col;
    for(let l=1;l<3;l++)o.forEach(d=>{let n=i+d;if(n>=0&&n<cart.tiles[l].length){let a=cart.tiles[l][n];a?.type==types.TILE2&&this.closeTiles.push(a)}});

    // 2 Platform levels
    let ct = getTile(this.x - 64, this.y + 32, 1);
    let ct2 = getTile(this.x - 64, this.y + 32, 2);
    let ct3 = getTile(this.x - 64, this.y + 32, 3);

    if (this.z < -115 && ct3.type == types.TILE2) cart.hero.lvl = 3;
    else if(this.z < -80 && ct2.type == types.TILE2) cart.hero.lvl = 2;
    else if (this.z < -40 && ct.type == types.TILE2) cart.hero.lvl = 1;
    else if (cart.hero.lvl == 3 && ct3.type == types.AIR) cart.hero.lvl = 2;
    else if (cart.hero.lvl == 2 && ct2.type == types.AIR) cart.hero.lvl = 1;
    else if (cart.hero.lvl == 1 && ct.type == types.AIR) cart.hero.lvl = 0;

    // Movement
    left()&&(newX-=spd,this.dir=1);
    right()&&(newX+=spd,this.dir=0);
    up()&&(newY-=spd/2);
    down()&&(newY+=spd/2);

    this.col = Math.round((newY / 64) + (newX / 128));
    this.row = Math.round((newY / 64) - (newX / 128)+1);

    let blocked=false;
    let tile = getTile(newX-64, newY+32, cart.hero.lvl);

    inbounds = (this.col >=0 && this.col < 10)&&(this.row >=0 &&  this.row < 10);

    // ABOVE
    if(cart.hero.lvl<3){
      blocked = tile != null && tile.type != types.TILE && cart.hero.jumpHeight < cart.hero.lvl+1*32;
      if(!blocked){
        tile = getTile(newX-64, newY+32, cart.hero.lvl+1);
        blocked = tile != null && tile.type == types.STOP  && cart.hero.jumpHeight < cart.hero.lvl+2*32;
      }
    }

    let stuck = cart.hero.currentTile == null ? false : cart.hero.currentTile.type == types.STOP;

    if((!blocked && inbounds) || stuck){
      this.y=newY;
      this.x=newX;
    }

    // sides
    if(this.row==-1){right()?this.y+=spd:up()&&(this.x-=spd);}
    if(this.col==-1){left()?this.y+=1:up()&&(this.x+=1);}
    if(this.row==10){left()?this.y-=1:down()&&(this.x+=1);}
    if(this.col==10){right()?this.y-=1:down()&&(this.x-=1);}
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
