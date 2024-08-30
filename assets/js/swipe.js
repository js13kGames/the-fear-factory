function draw() {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(canvasW / 2, canvasH / 2, radius, 0, Math.PI * 2);
    ctx.rect(canvasW, 0, -canvasW, canvasH); // A rectangle to cover the rest of the screen outside the circle
    ctx.fill();
    ctx.restore();

    if (shrinking) {
        radius -= 10; // Shrink speed
        if (radius <= 0) {
            shrinking = false;
            radius = 0;
            cart.changeLvl=true;
        }
    } else {
        radius += 10; // Expand speed
        if (radius >= maxRadius) {
          shrinking=true;
          return; // Stop the animation after the circle has fully expanded
        }
    }
}
