function Enemy(x, y, w, h, type, index, totalEnemies, dmg) {
  this.active=true;
  this.e = new Entity(w, h, 0, 0, 0, type);

  this.update = function(delta, mobs) {
  }
}
