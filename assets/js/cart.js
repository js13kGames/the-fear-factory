function Cart() {
  this.cam=new Camera();
  this.time=0;
  this.hero = new Hero(16, 16, 0, 0, 0, types.HERO);
  this.heroShadow = new Entity(11, 4, 0, 0, 0, types.SHADOW,1);
  this.shadow = new Entity(7, 3, 0, 0, 0, types.SHADOW,1);
  this.decor = new Decor();
  this.intro = new Intro();
  let prevNumber = 0;
  let runOnce=true;
  this.shake=0;
  this.shakeTime=0;
  this.shop=false;
  this.levels=[];
  this.trans=false;

  for(i=0;i<14;i++){
    this.levels.push(new Level(i));
  }

  this.cLevel=0;
  this.changeLvl=false;

  // Render & Logic
  this.update = function(delta, gameStarted=false) {
    let lvl = this.levels[this.cLevel];
    if(runOnce){
      var gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(1, '#17202a'); // Dark
      gradient.addColorStop(0, '#2c3e50'); // Lighter green at the bottom
    }

    if(gameStarted){
      // Screen shake
      this.shake = shaky ? rndNo(-2,2) : 0;
      if(this.shakeTime>0) this.shakeTime-=delta;

      // Camera follow hero
      this.cam.x = Math.ceil(lerp(-this.hero.e.x+350,this.cam.x,.8));
      var xadd = check? 120 : 160;
      this.cam.y = Math.ceil(lerp(-this.hero.e.y+xadd-this.hero.e.z,this.cam.y,.8));

      TIME += delta;
      mg.clear();

      // Background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      this.time+=delta;
      lvl.update(delta);

      //drawblock(192, 350, 128, 64, "#7a09fa"); // Test water
      if(this.trans){
        // If you have the key
        drawPortal(129+this.cam.x, this.cam.y);
      }
      this.hero.update(delta);
      this.hero.checkGun();

      let ht = this.hero.curTile;
      lvl.tiles.forEach((t) => {
        t.forEach((e) => {
          if(e.type == types.TILE2 && ht!=null){
            if ((e.row > ht.row) || (e.row <= ht.row && e.col > ht.col)){
              for(l = e.lvl; l > 0; l--){
                drawblock(e.x, e.y+33+(l*33), 128, 64, "#006769", false);
              }
              e.update(delta)
            }
          }
          // Draw traps
          if(e.obj!=null){
            e.obj.update(delta);
            if (this.hero.e.y>e.obj.y-20 && this.hero.curTile != null && this.hero.curTile.id>=e.obj.id){
              this.hero.e.update(delta)
            };
          }
        });
      });
      cart.hero.e.gun.drawBullets(delta);
      drawUI();

      // Check if level completed
      if(this.hero.hasKey && this.hero.curTile.id==1){
        draw();
        if(this.changeLvl){
         console.log("Load the next Level");
         cart.changeLvl=false;

        }
      }
    } else {
      // Intro Screen
      this.intro.update(delta);
    }
    this.trans = cart.hero.hasKey&&!shrinking;
  }

  this.reset = function(){a
    this.time=0;
    this.hero = new Hero(16, 16, 0, 0, 0, types.HERO);
    this.cart.hero.e.x=60;
    this.cart.hero.e.y=200;
    gameStarted=false;
    this.cam=new Camera();
  }
}
