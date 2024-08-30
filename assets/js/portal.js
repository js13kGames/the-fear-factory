let portal = {
       radius: 40,
       rotation: 0
   };

   const stars = [];

   function addStar(x,y) {
     let size = Math.random() * 5 + 2
       stars.push({
           x: x,
           y: y,
           size: size,
           angle: angle = Math.random() * 2 * Math.PI,
           speed: (Math.random() * 2 + 1) / size,
           life: 100,
           alpha: 1
       });
   }

   function updateStars() {
       stars.forEach((s, index) => {
           s.x += Math.cos(s.angle) * s.speed;
           s.y += Math.sin(s.angle) * s.speed;
           s.life -= 1;
           s.alpha = s.life / 100;

           if (s.life <= 0) {
               stars.splice(index, 1);
           }
       });
   }

   function drawPortal(x,y) {
       ctx.save();
       ctx.translate(x, y);
       ctx.rotate(portal.rotation);
       for (let i = 0; i < 10; i++) {
           ctx.beginPath();
           ctx.arc(0, 0, portal.radius, (i * Math.PI / 5), ((i + 1) * Math.PI / 5), false);
           ctx.lineWidth = 20;
           ctx.strokeStyle = i % 2 === 0 ? '#601848' : '#480048';
           ctx.stroke();

           ctx.beginPath();
           ctx.arc(0, 0, portal.radius/2-4, (i * Math.PI / 5), ((i + 1) * Math.PI / 5), false);
           ctx.lineWidth = 20;
           ctx.strokeStyle = i % 2 === 0 ? '#480048' : '#601848';
           ctx.stroke();
       }
       ctx.restore();
       portal.rotation += 0.03; // rotate the portal
   }

   function drawStars() {
       stars.forEach(s => {
           ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
           ctx.fillRect(s.x, s.y, s.size, s.size);
       });
   }
