function Spawner(hero){
  this.hero=hero;
  this.enemies = [];

  this.update = function(delta, t) {
    this.enemies.forEach(enemy => {
      enemy.update(delta, this.enemies);
      enemy.e.update(delta);
    });

    this.enemies = this.enemies.filter(function (i) {
     return i.active;
   });
  }

  this.addEnemy = function(numE, radius) {
  
  }

  this.addEnemy(30, 600);
}
