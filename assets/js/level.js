function Level(no=0) {
  // setup tiles
  this.rows = 10;
  this.cols = 10
  this.tiles=[];
  this.mobs=[];
  this.key = new Key(-50, 300);

  let id =0;
  let tt=[];

  if(no==0){
    this.rows = 5;
    this.cols = 4;
  }

  for(l = 0; l < 5; l++){
    id=0;
    for (r = 0; r < this.rows; r++) {
      //console.log("row: " + r)
      for (c = 0; c < this.cols; c++) {
        id++;
        //console.log("col: " + c + " id: " + id)
        xx = (c - r) * 64;
        yy = (c + r) * 32;
        let type = types.TILE;
        if(l>0)type = types.AIR;
        var tile = new Entity(32, 16, xx, yy-(l*32), 0, type);
        tile.id=id;
        tile.lvl=l;
        tt.push(tile);
      }
    }
    this.tiles.push(tt);
    tt=[];
  }

  if(no==0){
    this.tileCol1= "#273746";
    this.tileCol2= "#566573";
    //addPlat(1,3, this.tiles);
    addPlat(2,6, this.tiles);
    addPlat(1,12, this.tiles);
    addPlat(1,20, this.tiles);
    addPlat(2,18, this.tiles);
    //addPlat(1,4, this.tiles);
    //addPlat(2,6, this.tiles);
    //addPlat(3,7, this.tiles);
  } else {
    this.tileCol1= "#273746";
    this.tileCol2= "#566573"; sd
  }

  // Add Fire, Spike and Ghost
  //this.mobs.push(new Spike(88, 5));
  //this.mobs.push(new Fire(84, 110));
  //this.mobs.push(new Ghost(84, 200));

  this.update = function(delta){
  this.tiles.forEach(e => e.sx=16);

    // if(this.hero.currentTile != null){
    //   this.hero.currentTile.sx=49;
    // }

    drawIsometricRoom(this.tileCol1,this.tileCol2, this.rows, this.cols);

    this.tiles.forEach((t) => {
      t.forEach((e) => {
        if(e.type != types.STOP && e.type != types.AIR){
          if(e.type==types.TILE2){
            for(l = e.lvl; l > 0; l--){
              drawblock(e.x, e.y+33+(l*33), 128, 64, "#57065e", false);
            }
          }
          e.update(delta)
        };
      });
    });

    this.mobs.forEach(e => e.update(delta));
    this.key.update(delta);
  }
}

function addPlat(lvl, id, tiles){
  for(l = lvl; l >= 0; l--){
    console.log("Current Level: " + l);
    t=tiles[l][id-1];
    if(l==lvl){
       t.type=types.TILE2;
       console.log("tileID: " + t.id + " id: " + id + " level: " + l + " - tile2");
     } else {
       console.log("tileID: " + t.id + " id: " + id + " level: " + l + " - STOP");
       t.type=types.STOP;
     }
     t.setType();
  }
}
