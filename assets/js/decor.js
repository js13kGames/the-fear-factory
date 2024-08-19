function Decor(){
  this.decors = [];

  var areaSize = 1000; // Define the range for random placement
  var num = 20; // Number to place

  for (let i = 0; i < num; i++) {
    let x = Math.random() * (2 * areaSize) - areaSize;
    let y = Math.random() * (2 * areaSize) - areaSize;
    this.decors.push(new Entity(9, 6, x, y, 0, types.SMALLROCK));
  }

  this.update = function(delta, t) {
    // Update each rock based on game delta time
    this.decors.forEach(rock => {
      rock.update(delta);
    });
  }
}
