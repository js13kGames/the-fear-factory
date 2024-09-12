// ╔══════════════════════════════════╗
// ║ JS13K template by @CarelessLabs  ║
// ╚══════════════════════════════════╝

// Reference for new atlas
let canvasW = window.innerWidth;
let canvasH = window.innerHeight;
let gameStarted = false;
let charSet=0;
let delta = 0.0;
let prevDelta = Date.now();
let currentDelta = Date.now();
let TIME = 0;
let mousePos = new vec2(0,0);
let RELOAD=false;
let WIN = false;
let STAGE=0;
let atlas = new Image();
atlas.src = "atlas.png";
let cart = new Cart();
let start=false;
let music=false;
let pause=false;
let leftMB=false;
let startDelay=0.1;
let zoom=4;
let fps = 60; // default value
let frameCount = 0;
let elapsedTime = 0;
let startX = 0;//canvasW / 2;
let startY = 0;//canvasH;
let a = navigator.userAgent;
let check = a.match(/Android/i)!=null||a.match(/iPhone/i)!=null||a.match(/iPad/i)!=null;
var nativeWidth = 812;  // The resolution the game is designed to look best in
var nativeHeight = check?375:470;
var scaleFillNative = Math.max(canvasW / nativeWidth, canvasH / nativeHeight);
let shaky = true;
let loading = 1.5;
let debug=false;
let block = new Entity(32, 16, 0, 0, 0, types.BLOCK);
let swipeWidth = 0;
let shrinking = false;
var mobUp=false;
var mobDown=false;
var mobRight=false;
var mobLeft=false;
var mobJump=false;
// Track touch identifiers
let joystickTouchId = null;
let buttonTouchId = null;

let dialogue = {
    active: false,
    text: "",
    currentText: "",
    charIndex: 0,
    boxWidth: 0,
    startX: 0,
    startY: 0,
    textSpeed: 20, // milliseconds per character
    nextCharTime: 0,
    fontSize: "30px",
    fontFamily: "Verdana",
    wait:0,
    done:false
};

// Load the music player
genAudio();

// Called by body onload on index page
function startGame() {
  mg.start();
  resizeCanvas(this.ctx);
  setupControls();
  document.getElementById('gameControls').addEventListener('touchstart', (event) => {
      event.preventDefault();  // Prevent scrolling/zooming on the control buttons
  }, { passive: false });
  if (!check) document.getElementById("gameControls").style.display = "none";
}

let mg = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = nativeWidth * scaleFillNative;
    this.canvas.height = nativeHeight * scaleFillNative;
    this.context = this.canvas.getContext("2d");
    this.context.scale(1, 1);
    this.context.setTransform(scaleFillNative, 0, 0, scaleFillNative, 0, 0);
    const gl = this.canvas.getContext("webgl");
    // PixelArt Sharp
    ctx=this.context;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    this.canvas.classList.add("screen");
    document.body.insertBefore(this.canvas, document.body.childNodes[6]);

    // Run the game loop
    this.frameId = requestAnimationFrame(updateGameLoop);

    //Mobile
    window.addEventListener('touchstart', function(e) {
      if(!music){
        music=true
        audio.loop=true;
        audio.play();
        if(audioCtx == null) audioCtx = new AudioContext();
      }
      if(startDelay<=0&&charSet==3)start=true;
    })

    // Keyboard
    window.addEventListener('keydown', function(e) {
      if(!music){
        music=true
        audio.loop=true;
        audio.play();
        if(audioCtx == null) audioCtx = new AudioContext();
      }
      if(startDelay<=0&&charSet==3)start=true;
      e.preventDefault();
      mg.keys = (mg.keys || []);
      mg.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      mg.keys[e.keyCode] = (e.type == "keydown");
      if(e.keyCode==R) RELOAD=true;
      if(e.keyCode==M) pause=!pause;
      if(e.keyCode==T) cart.tips=!cart.tips;
    })
    window.addEventListener('mouseup', function(e) {
      e.preventDefault();
      if (e.button === 0) {
        leftMB=false;
      }
    })
    window.addEventListener('mousedown', function(e) {
      e.preventDefault();
      if (e.button === 0) {
        leftMB=true;
      }
    })
    // Add an event listener for window resize.
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function(e) {
      e.preventDefault();
      var r = mg.canvas.getBoundingClientRect();
      mousePos.set((e.clientX - r.left) / (r.right - r.left) * canvasW,
                   (e.clientY - r.top) / (r.bottom - r.top) * canvasH);
    })
    // Disable right click context menu
    this.canvas.oncontextmenu = function(e) {
      e.preventDefault();
    };
  },
  stop: function() {
    if (mg.frameId) {
      cancelAnimationFrame(mg.frameId);
      // Reset the frameId
      mg.frameId = null;
    }
  },
  clear: function() {
    this.context.clearRect(0, 0, 4*this.canvas.width, 4*this.canvas.height);
  }
}

// Mobile Controls
function setupControls() {
  let joystick = document.getElementById('joystick');
  let joystickContainer = document.getElementById('joystickContainer');
  let maxRadius = 154 / 2; // Radius of the joystick container
  let dragging = false;
  let origin = { x: 0, y: 0 };
  let knobPosition = { x: 0, y: 0 };

  // Start dragging the joystick
  joystick.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (joystickTouchId === null) {
        joystickTouchId = e.changedTouches[0].identifier;  // Assign the touch identifier to the joystick
        draggingJoystick = true;
        origin = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  // Move the joystick
  document.addEventListener('touchmove', function(e) {
      if (draggingJoystick) {
          // Find the touch with the joystick identifier
          for (let touch of e.touches) {
              if (touch.identifier === joystickTouchId) {
                  let deltaX = touch.clientX - origin.x;
                  let deltaY = touch.clientY - origin.y;
                  let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                  // Limit joystick movement within the radius
                  if (distance > maxRadius) {
                      let angle = Math.atan2(deltaY, deltaX);
                      deltaX = Math.cos(angle) * maxRadius;
                      deltaY = Math.sin(angle) * maxRadius;
                  }

                  knobPosition = { x: deltaX, y: deltaY };
                  joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

                  // Detect directions based on the joystick position
                  mobUp = deltaY < -20; // Threshold to prevent jitter
                  mobDown = deltaY > 20;
                  mobLeft = deltaX < -20;
                  mobRight = deltaX > 20;

                  break;  // Stop looking for other touches once the joystick touch is processed
              }
          }
      }
  });

  // Stop dragging the joystick
  document.addEventListener('touchend', function(e) {
      for (let touch of e.changedTouches) {
          if (touch.identifier === joystickTouchId) {
              draggingJoystick = false;
              joystickTouchId = null;
              joystick.style.transform = 'translate(-50%, -50%)';  // Reset to center
              knobPosition = { x: 0, y: 0 };

              // Reset directional flags
              mobUp = false;
              mobDown = false;
              mobLeft = false;
              mobRight = false;
          }
      }
  });

  // Track touch identifiers for buttons A and B
  let aButtonTouchId = null;
  let bButtonTouchId = null;

  // Handle A button touch
  document.getElementById('aButton').addEventListener('touchstart', function(e) {
      if (aButtonTouchId === null) {
          aButtonTouchId = e.changedTouches[0].identifier; // Assign touch identifier to A button
          action('A');
      }
  }, { passive: false });

  document.getElementById('aButton').addEventListener('touchend', function(e) {
      for (let touch of e.changedTouches) {
          if (touch.identifier === aButtonTouchId) {
              aButtonTouchId = null; // Reset A button touch identifier when touch ends
          }
      }
  }, { passive: false });

  // Handle B button touch
  document.getElementById('bButton').addEventListener('touchstart', function(e) {
      if (bButtonTouchId === null) {
          bButtonTouchId = e.changedTouches[0].identifier; // Assign touch identifier to B button
          action('B');
      }
  }, { passive: false });

  document.getElementById('bButton').addEventListener('touchend', function(e) {
      for (let touch of e.changedTouches) {
          if (touch.identifier === bButtonTouchId) {
              bButtonTouchId = null; // Reset B button touch identifier when touch ends
          }
      }
  }, { passive: false });
}

function action(button) {
    // Handle action button logic here
    if(!gameStarted){
      gameStarted=true;
    }
    if(button=='B')mobJump=true;
}

function move(d) {
    // Handle movement logic here
    if(d=='up'){
      mobUp=true;
    } else if(d=='down'){
      mobDown=true;
    } else if(d=='left'){
      mobLeft=true;
    } else if(d=='right'){
      mobRight=true;
    }
}

function stopmove(d) {
    if(d=='up'){
      mobUp=false;
    } else if(d=='down'){
      mobDown=false;
    } else if(d=='left'){
      mobLeft=false;
    } else if(d=='right'){
      mobRight=false;
    }
}


let lastTimestamp = null;
function updateGameLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;

  // Calculate the delta time (in seconds)
  let deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // Update the FPS every second
  elapsedTime += deltaTime;
  frameCount++;
  if (elapsedTime >= 1.0) { // Update the FPS once every second
    fps = frameCount / elapsedTime;
    frameCount = 0;
    elapsedTime = 0;
  }

  let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

  if (gamepads[0]) {
    let gp = gamepads[0];

    // Initialize audio on the first button press
    if (!music) {
      if (gp.buttons[0].pressed || gp.buttons[1].pressed || gp.buttons[2].pressed || gp.buttons[3].pressed) {
        music = true;
        audio.loop = true;
        audio.play();
        if (audioCtx == null) audioCtx = new AudioContext();
      }
    }

    // Handle movement (assuming the left stick is used for movement)
    mobLeft = gp.axes[0] < -0.5;
    mobRight = gp.axes[0] > 0.5;
    mobUp = gp.axes[1] < -0.5;
    mobDown = gp.axes[1] > 0.5;

    // Handle action buttons (assuming button 0 is jump)
    mobJump = gp.buttons[0].pressed;
    RELOAD = gp.buttons[1].pressed;
  }

  // Update the game state and render
  updateGameArea(deltaTime);

  // Display FPS
  if(debug) displayFPS(fps);

  // Request the next frame
  mg.frameId = requestAnimationFrame(updateGameLoop);
}

function updateGameArea(delta) {
  if(start) gameStarted=true;
  if(startDelay>0)startDelay-=delta;
  cart.update(delta, gameStarted);

  // Reset Click to false
  // If it is still true on the next loop could cause an unexpected action
  processClick=false;
}

function left() {return (mg.keys && (mg.keys[LEFT] || mg.keys[A]) || mobLeft);}
function right() {return (mg.keys && (mg.keys[RIGHT] || mg.keys[D])|| mobRight);}
function up() {return (mg.keys && (mg.keys[UP] || mg.keys[W])|| mobUp);}
function down() {return (mg.keys && (mg.keys[DOWN] || mg.keys[S])|| mobDown);}
function space() {return (mg.keys && mg.keys[SPACE])|| mobJump ;}
function t() {return mg.keys && (mg.keys[T]);}

function resizeCanvas() {
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  scaleFillNative = Math.max(canvasW / nativeWidth, canvasH / nativeHeight);
  scaleFitNative = Math.min(canvasW / nativeWidth, canvasH / nativeHeight);
  ctx.canvas.width = nativeWidth * scaleFillNative;
  ctx.canvas.height = nativeHeight * scaleFillNative;
  this.context = ctx.canvas.getContext("2d");
  this.context.setTransform(scaleFillNative, 0, 0, scaleFillNative, 0, 0);
  this.ctx.mozImageSmoothingEnabled = false;
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.imageSmoothingEnabled = false;
}
