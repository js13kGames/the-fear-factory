function Level(no=0) {
  // setup tiles
  let rows = 10;
  let cols = 10
  this.tiles=[];
  this.spikes=[];

  if(no==0){
    this.tileCol1= "#273746";
    this.tileCol2= "#566573";
  } else {
    this.tileCol1= "#273746";
    this.tileCol2= "#566573";
  }

  let id =0;
  let tt=[];

  for(l = 0; l < 4; l++){
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        id++;
        xx = (c - r) * 64;
        yy = (c + r) * 32;
        let type = types.TILE;

        // under the first step is a blocker
        if(l==0 && id == 15){
          type = types.STOP;
        }

        // Level 1 step
        if(l==1 && id == 115){
          type = types.TILE2;
        } else if(l==1) {
          type = types.AIR;
        }

        // STEP 2
        if(l==1 && id == 117){
          type = types.STOP;
        }
        if(l==2 && id == 217){
          type = types.TILE2;
        } else if(l==2) {
          type = types.AIR;
        }

        if(l==0 && id == 17){
          type = types.STOP;
        }

        //if(l==3 && id == 319){
          //type = types.TILE2;
        if(l==3) {
          type = types.AIR;
        }

        var tile = new Entity(32, 16, xx, yy-(l*32), 0, type);
        tile.id=id;
        tt.push(tile);
      }
    }
    this.tiles.push(tt);
    tt=[];
  }

  var spike = new Spike(88, 5);
  this.spikes.push(spike);

  var spike = new Fire(84, 110);
  this.spikes.push(spike);

  var ghost = new Ghost(84, 200);
  this.spikes.push(ghost);

  this.update = function(delta){
    this.tiles.forEach(e => e.sx=16);

    // if(this.hero.currentTile != null){
    //   this.hero.currentTile.sx=49;
    // }

    drawIsometricRoom(this.tileCol1,this.tileCol2);

    this.tiles.forEach((t) => {
      t.forEach((e) => {
        if(e.type != types.STOP && e.type != types.AIR){e.update(delta)};
      });
    });
  }
}
