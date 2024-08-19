function Gun(){
  this.ammo=1000;
  this.bullets=[];
  this.rate=.1;
  this.wait=0;
  this.type=guntype.ONESHOT;
  this.angles = [0];
  this.r=0.0174533;
  this.distance = 200;
  this.particles=[];

  this.addBullets = function(ox,oy,dx,dy,e){
    // Remove old drawBullets
    if(this.ammo>0 && this.wait<=0){
      this.wait=this.rate;

      // Angle of mouse and hero centre
      var angle = Math.atan2(dy - oy, dx - ox);
      this.angle = Math.atan2(dy - oy, dx - ox);
      this.bullets.push(new Bullet(ox,oy,dx,dy,e,this.distance,this));
    }
  }

  this.drawBullets = function(delta, friendly=false){
    if(this.wait>0){
      this.wait-=delta;
    }

    this.bullets.forEach(e => e.draw(delta, friendly));

    this.particles.forEach(p => {p.update(delta);});

    // Remove bullets
    this.bullets = this.bullets.filter(function (b) {
      return b.active == true;
    });
  }
}

function Bullet(ox,oy,dx,dy,parent,distance,gun){
  this.speed = 500;
  this.w = 60;
  this.h = 30;
  this.dst=0;
  this.active=true;
  this.hb = new rectanlge(ox, oy, this.w, this.h);
  this.dist=0;
  this.accuracy=20;
  this.shadow = new Entity(6, 6, 0, 0, 0, types.SHADOW);
  this.shadow.alpha=.1;
  this.distance=distance;
  this.gun=gun;

  // Calculate the direction vector
   let dirX = dx - ox;
   let dirY = dy - oy;

   // Apply accuracy adjustment
   dirX += (Math.random() - 0.5) * 2 * this.accuracy;
   dirY += (Math.random() - 0.5) * 2 * this.accuracy;

   // Normalize the direction vector
   const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
   const normX = dirX / magnitude;
   const normY = dirY / magnitude;

   // Scale the normalized vector by speed
   this.dx = normX * this.speed;
   this.dy = normY * this.speed;

   this.v = new vec2(parent.x + 60, parent.y + 50 + parent.z);
   this.angle = Math.atan2(normY, normX);

  this.draw = function(delta, friendly = false){
    // Update Position
    if(this.active){
      this.shadow.update(delta);
      this.shadow.setV(this.v.x, this.v.y+30);
      
      // Previous position
      xx = this.v.x;
      yy = this.v.y;

      // New Position
      this.v.x +=(this.dx*delta);
      this.v.y +=(this.dy*delta);

      this.dist +=  Math.sqrt( ((this.v.x-xx)*(this.v.x-xx)) + ((this.v.y-yy)*(this.v.y-yy)) );

      if(this.dist > this.distance){
         this.active = false;
         this.gun.particles.push(new Dusty(xx,yy));
       }

      // Draw
      ctx.save();
      ctx.translate(this.v.x, this.v.y);
      ctx.translate(cart.cam.x,cart.cam.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = .8;
      ctx.beginPath();
      ctx.fillStyle = "#f2f4f4";
      ctx.roundRect(0, 0, 40, 20, 30);
      ctx.fill();
      ctx.restore();
    }
  }
}
