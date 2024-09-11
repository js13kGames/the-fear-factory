function Level(no=0) {
  // setup tiles
  this.rows = 10;
  this.cols = 10
  this.tiles=[];
  this.mobs=[];
  this.redraw=[];
  this.time=0;
  this.text="";
  this.help="";
  this.done=false;

  let id =0;
  let tt=[];

  this.rows = 5;
  this.cols = 5;

  if(no==0){
    this.rows = 4;
    this.cols = 4;
  } else if(no==1){
    this.rows = 4;
    this.cols = 5;
  } else if(no==2){
    this.rows = 5;
    this.cols = 6;
  } else if(no==7){
    this.rows = 5;
    this.cols = 8;
  } else if(no==8){
    this.rows = 3;
    this.cols = 10;
  } else if(no==9){
    this.rows = 12;
    this.cols = 12;
  } else if(no==10){
    this.rows = 5;
    this.cols = 20;
  }

  this.addPlat = function(lvl, id){
    for(l = lvl; l >= 0; l--){
      t=this.tiles[l][id-1];
      if(l==lvl){
         t.type=types.TILE2;
       } else {
         t.type=types.STOP;
       }
       t.setType();
    }
  }

  this.addSpike = function(l, id, off, pause=0){
    t=this.tiles[l][id-1];
    t.obj=new Spike(t.x+90, t.y+4, id, off, l, pause);
  }

  this.addKey = function(l, id){
    t=this.tiles[l][id-1];
    t.obj=new Key(t.x+70, t.y-4, l, id);
  }

  this.addFire = function(l, id){
    t=this.tiles[l][id-1];
    t.obj=new Fire(t.x+80, t.y-20, l, id);
  }

  this.addGhost = function(l, id, id2){
    let t=this.tiles[l][id-1];
    let t2=this.tiles[l][id2-1];
    // DOWN-UP = 1
    // UP-DOWN = 2
    // LEFT-RIGHT =
    //if(dir==1){ // UPDOWN
    t.obj=new Ghost(t.x+64, t.y-64, t2.x+64, t2.y-64, l);
    //} else {
    //t.obj=new Ghost(t.x+64, t.y-64, t2.x+64, t2.y-64, l);
    //}

  }

  // Populate 4 levels of tiles in a block
  for(l = 0; l < 5; l++){
    id=0;
    for (r = 0; r < this.rows; r++) {
      for (c = 0; c < this.cols; c++) {
        id++;
        xx = (c - r) * 64;
        yy = (c + r) * 32;
        let type = types.TILE;
        if(l>0)type = types.AIR;
        var tile = new Entity(32, 16, xx, yy-(l*32), 0, type);
        tile.id=id;
        tile.lvl=l;
        tile.row=r;
        tile.col=c;
        tt.push(tile);
      }
    }
    this.tiles.push(tt);
    tt=[];
  }

  // this.tileCol1= "#273746";
  // this.tileCol2= "#566573";

  // Tutorial LEVEL 01
  if(no==0){ // LEARN: KEY
    this.tileCol1= "#480048";
    this.tileCol2= "#601848";
    this.text="Welcome to the Fear Factory! Click or press Space..."
    this.help="The level is unstable, enter the portal quickly!"
    this.t2="#FFDC7F";
    this.addKey(0, 16);

  // LEVEL 02
  } else if(no==1) { // LEARN JUMP
    this.addKey(0, 10);
    this.text="Press space to jump over blocks."
    this.help="Move along dont be scared.."
    this.tileCol1= "#C3C3E5";
    this.tileCol2= "#F1F0FF";
    this.t2="#295F98";
    this.blkColr="#7C93C3";
    this.addPlat(1,3);
    this.addPlat(1,8);
    this.addPlat(1,13);
    this.addPlat(1,18);

  // LEVEL 03
  } else if(no==2) { // LEARN PARKOUR
    this.addKey(2, 17);
    this.text="Do you have any parkour skils?"
    this.help="I thought you were afraid of heights!"
    this.tileCol1= "#C3C3E5";
    this.tileCol2= "#F1F0FF";
    this.t2="#295F98";
    this.blkColr="#7C93C3";
    this.addPlat(1,15);
    this.addPlat(2,17);

  // LEVEL 04
  } else if(no==3) { // LEARN SPIKES
    [0, 0.5, 0, 0.5, 0].forEach((z, i) => this.addSpike(0, 3 + 5 * i,0));
    this.text="This may trigger your Aichmophobia! Jump over or wait for the spikes to drop."
    this.help="It will get more difficult, move along."
    this.addKey(0, 15);
    this.tileCol1= "#028482";
    this.tileCol2= "#7ABA7A";

  // LEVEL 05
  } else if(no==4) { // LEARN SPIKES
    [.5,0, .5, 0, .5].forEach((z, i) => this.addSpike(0, 2 + 5 * i,z,1));
    [0, .5, 0, .5, 0].forEach((z, i) => this.addSpike(0, 3 + 5 * i,z,1));
    [.5,0, .5, 0, .5].forEach((z, i) => this.addSpike(0, 4 + 5 * i,z,1));

    this.text="Spikes can move at different rates, dont be afaid, run for it!"
    this.help="Not bad..."
    this.addKey(0, 15);
    this.tileCol1= "#028482";
    this.tileCol2= "#7ABA7A";

  // LEVEL 06
  } else if(no==5) { // LEVEL 1
    this.addKey(3, 5);
    this.text=" Things are heating up and I hear you have Pyrophobia?"
    this.help="Have I met my match..."
    this.tileCol1= "#C3C3E5";
    this.tileCol2= "#F1F0FF";
    this.t2="#295F98";
    this.blkColr="#7C93C3";
    this.addFire(0,7);
    this.addFire(0,8);
    this.addPlat(1,17);
    this.addPlat(1, 18);
    this.addPlat(2, 20);
    this.addPlat(3, 10);
    this.addPlat(3, 5);

// LEVEL 07
  } else if(no==6) {
    this.addKey(3, 4);
    this.text=""
    this.help=""
    this.tileCol1= "#C3C3E5";
    this.tileCol2= "#F1F0FF";
    this.t2="#295F98";
    this.blkColr="#7C93C3";
    this.addPlat(1, 17);
    this.addPlat(2, 19);
    this.addPlat(3, 4);
    this.addPlat(3, 9);
    this.addSpike(1, 17, .5, .5);
    this.addSpike(2, 19, 0, .5);

  // LEVEL 08
  } else if(no==7) {
    this.addKey(0, 7);
    this.text="Do not fall into the void..."
    this.help=""
    this.tileCol1= "#C3C3E5";
    this.tileCol2= "#F1F0FF";
    this.t2="#295F98";
    this.blkColr="#7C93C3";
    this.addPlat(1, 26);
    this.addPlat(2, 28);
    this.addPlat(3, 30);

    tilesToAir(0, 4, 4, 5, this.tiles[0], this.cols);

  // LEVEL 09
  } else if(no==8) { // Narrow with jumps
    this.addKey(0, 20);
    this.text="Do not fall into the void..."
    this.help=""
    this.tileCol1= "#C3C3E5";
    this.tileCol2= "#F1F0FF";
    this.t2="#295F98";
    this.blkColr="#7C93C3";
    tilesToAir(0, 2, 2, 2, this.tiles[0], this.cols);
    this.addSpike(0, 4, 1);
    this.addSpike(0, 14, 1);
    this.addSpike(0, 24, 1);
    tilesToAir(0, 2, 5, 5, this.tiles[0], this.cols);
    tileToAir(18, this.tiles[0]);
    this.addFire(0, 7, 1);
    this.addSpike(0, 17, 1);
    this.addFire(0, 27, 1);
    this.addFire(0, 28, 1);
    this.addFire(0, 8, 1);

  // LEVEL 10
  } else if(no==9) {
    this.text="Level 10"
    this.help="Well done"
    this.addKey(0, 24);
    tilesToAir(0, 11, 2, 3, this.tiles[0], this.cols);
    [[25,.5],[26,.5],[49,0],[50,0],[73,.4],[74,.4],[85,.3],[86,.3],[97,.2],[98,.2],[109,0],[110,0]].map(a=>this.addSpike(0,a[0],a[1]));
    [[2,89],[3,65],[4,41]].map(a=>this.addPlat(a[0],a[1]));
    tilesToAir(0, 11, 5, 6, this.tiles[0], this.cols);
    [123,124,113,7,140,141].map(n=>this.addPlat(1,n));
    [32,56,80,84,104,108,95,119].map(n=>this.addFire(0,n));
    tilesToAir(0, 11, 8, 9, this.tiles[0], this.cols);
    [[120,2.2,1.5],[107,1.7,1.5],[96,1.3,1.5],[83,1,1.5]].map(a=>this.addSpike(0,a[0],a[1],a[2]));
    [47,36,23].map(n=>tileToAir(n,this.tiles[0],this.cols));
    this.t2="#295F98";
    this.tileCol1= "#028482";
    this.tileCol2= "#7ABA7A";

  // Level 11
  } else if(no==10) {
    this.text="Level 11"
    this.help="Well done"
    this.addKey(0, 24);
    this.addGhost(0, 81, 1);
    this.addGhost(0, 1, 4);
    this.addGhost(0, 4, 84);
    this.addGhost(0, 82, 81);

  }

  // Add Fire, Spike and Ghost
  //this.mobs.push(new Spike(-128, 192));
  //this.mobs.push(new Fire(84, 110));
  //this.mobs.push(new Ghost(84, 200));

  this.update = function(delta){
    //this.tiles.forEach(e => e.sx=16);
    // if(this.hero.curTile != null){
    //   this.hero.curTile.sx=49;
    // }
    this.time+=delta;

    this.tiles.forEach((t) => {
      t.forEach((e) => {
        if(cart.hero.hasKey && this.done && e.lvl > 0){
          if(e.type==types.TILE2){
            e.fly=true;
          } else {
            e.type=types.AIR;
            e.setType();
          }
        }
        if(e.type != types.STOP && e.type != types.AIR){
          if(e.type==types.TILE2){
            for(l = e.lvl; l > 0; l--){
              drawblock(e.x, e.y+33+(l*33), 128, 64, this.blkColr, false);
            }
            if(!e.fly&&e.type!=types.AIR) drawIsoTile(this.t2,this.t2, e.row, e.col, this.time, cart.trans,(e.lvl*33)); // DRAW TILE2
          }
          // calculateZ (x, y, amplitude, wavelength, frequency, time)
          if(cart.trans&&e.type!=types.TILE2)e.z=calculateZ(e.x, e.y, 5, 20, .3, this.time);
          if(e.lvl==0&&e.type!=types.AIR) drawIsoTile(this.tileCol1,this.tileCol2, e.row, e.col, this.time, cart.trans);
          e.update(delta);
        };
        // Draw traps
        if(e.obj!=null){
          e.obj.update(delta);
        }
      });
    });

    this.mobs.forEach(e => e.update(delta));
  }
}
