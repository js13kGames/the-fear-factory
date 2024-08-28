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
  this.lvl=0;

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

    let rz = cart.levels[cart.cLevel].rows;
    let cz = cart.levels[cart.cLevel].cols;

    // TODO fix this code.

    let o=[1,cz,cz+1],t=cart.hero.currentTile?.id; // close tiles check TODO change to use the grid size
    let i=(this.row*cz)+this.col;
    for(let l=1;l<5;l++)o.forEach(d=>{let n=i+d;if(n>=0&&n<cart.levels[cart.cLevel].tiles[l].length){let a=cart.levels[cart.cLevel].tiles[l][n];a?.type==types.TILE2&&this.closeTiles.push(a)}});

    // Check the hero platform level, 1-4a
    let pos = [this.x - 64, this.y + 32];
    let [ct, ct2, ct3, ct4] = [1, 2, 3, 4].map(lvl => getTile(...pos, lvl));

    let conditions = [
      { z: -135, lvl: 4, ct: ct4 },
      { z: -115, lvl: 3, ct: ct3 },
      { z: -80,  lvl: 2, ct: ct2 },
      { z: -40,  lvl: 1, ct: ct }
    ];

    for (let c of conditions) {
      if (this.z < c.z && c.ct.type == types.TILE2) cart.hero.lvl = c.lvl;
      else if (cart.hero.lvl == c.lvl && c.ct != null && c.ct.type == types.AIR) cart.hero.lvl--;
    }

    // Movement
    left()&&(newX-=spd,this.dir=1);
    right()&&(newX+=spd,this.dir=0);
    up()&&(newY-=spd/2);
    down()&&(newY+=spd/2);

    this.col = Math.round((newY / 64) + (newX / 128));
    this.row = Math.round((newY / 64) - (newX / 128)+1);
    let blocked=false;
    let tile = getTile(newX-64, newY+32, cart.hero.lvl);

    inbounds = (this.col >=0 && this.col < cz)&&(this.row >=0 &&  this.row < rz);

    // ABOVE
    if(cart.hero.lvl<3){
      blocked = tile != null && tile.type != types.TILE && cart.hero.jumpHeight < cart.hero.lvl+1*32;
      if(!blocked){
        tile = getTile(newX-64, newY+32, cart.hero.lvl+1);
        blocked = tile != null && tile.type == types.STOP  && cart.hero.jumpHeight < cart.hero.lvl+2*32;
      }
    }

    let stuck = cart.hero.currentTile == null ? false : cart.hero.currentTile.type == types.STOP;

    // TODO - check if the player is hitting a STOP with no chance of landing on top of platform
    // let nxtTile=getTile(newX-64, newY+32, this.lvl)
    // let stuck = nxtTile == null ? false : nxtTile.type == types.STOP;
    // console.log(34.4*cart.hero.lvl + " " + cart.hero.e.z + " " + this.lvl);
    // if(stuck) stuck = cart.hero.e.z > -34.4*cart.hero.lvl;

    if((!blocked && inbounds) || stuck){
      this.y=newY;
      this.x=newX;
    }

    // Edge of Map collisions
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
      case types.SPIKE:
        this.sy=23;
        break;
      case types.FIRE:
        this.sx=49;
        this.sy=35;
        break;
      case types.GHOST:
        this.sx=83;
        break;
      case types.KEY:
        this.sx=31;
        this.sy=35;
        break;
    }

    this.hWidth = this.width / 2;
    this.hHeight = this.height / 2;
  }

  this.setType();
}
