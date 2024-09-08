function Cart() {
  this.cam=new Camera();
  this.time=0;
  this.hero = new Hero(16, 16, 0, 0, 0, types.HERO);
  this.gob = new Entity(22, 15, 100, 100, 0, types.GOB);
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
  this.dialogue = {
      active: false,
      text: "",
      currentText: "",
      charIndex: 0,
      boxWidth: 0,
      boxHeight: 0,
      startX: 0,
      startY: 0,
      textSpeed: 50, // milliseconds per character
      nextCharTime: 0,
      fontSize: "20px",
      fontFamily: "Arial"
  };
  for(i=0;i<14;i++){
    this.levels.push(new Level(i));
  }

  this.cLevel=0;
  this.changeLvl=false;

  // Render & Logic
  this.update = function(delta, gameStarted=false) {
    // Mute - UnMute music
    if(audio) audio.muted=pause;
    let lvl = this.getLvl();
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
      if(this.hero.fall){ // Only draw if not falling
        this.hero.draw(delta);
      }
      lvl.update(delta);

      if(lvl.text != ""){
        textToScreen(lvl.text);
        lvl.text="";
      } else if(this.hero.hasKey && lvl.help!="" && swipeWidth <= 0){
        textToScreen(lvl.help);
        lvl.help="";
      }

      if(this.trans){
        // If you have the key
        drawPortal(129+this.cam.x, this.cam.y);
      }
      this.hero.update(delta);
      this.hero.checkGun();

      let ht = this.hero.curTile;
      let lv=this.getLvl();
      lvl.tiles.forEach((t) => {
        t.forEach((e) => {
          if(e.type == types.TILE2 && ht!=null){
            if ((e.row > ht.row) || (e.row <= ht.row && e.col > ht.col)){
              for(l = e.lvl; l > 0; l--){
                //console.log("Tile Row: " + e.row + " Hero Row: " + ht.row + " Tile Col: " + e.col + " Hero Col: " + ht.col);
                drawblock(e.x, e.y+33+(l*33), 128, 64, lv.blkColr, false);
              }
              if(!e.fly&&e.type!=types.AIR)drawIsoTile(lv.t2,lv.t2, e.row, e.col, this.time, cart.trans,(e.lvl*33));
              e.update(delta)
            }
          }
          // Draw traps
          if(e.obj!=null){
            e.obj.update(delta);
            if (this.hero.lvl==e.obj.level&&this.hero.e.y>e.obj.y && this.hero.curTile != null && this.hero.curTile.id>=e.obj.id){
              this.hero.e.update(delta)
            };
          }
        });
      });
      cart.hero.e.gun.drawBullets(delta);

      // Check if level completed
      if(this.hero.hasKey && this.hero.curTile.id==1){
        draw();
        if(this.changeLvl){
          playSound(LEVEL,.8);
          cart.changeLvl=false;
        }
      }
    } else {
      // Intro Screen
      this.intro.update(delta);
    }
    this.trans = cart.hero.hasKey&&!shrinking;

    drawDialogueBox(delta);
    if (this.dialogue.active){
      this.gob.x=-this.cam.x;
      this.gob.y=-this.cam.y;
      this.gob.update(delta);
    }
  }

  this.getLvl = function(){
    return this.levels[this.cLevel];;
  }

  this.resetLvl = function(id=null){
    if(id!=null)this.cLevel=id;
    cart.levels[this.cLevel] = new Level(this.cLevel);
    this.hero.e.x=0;
    this.hero.e.y=0;
    this.hero.hasKey=false;
    this.time=0;
  }
}
