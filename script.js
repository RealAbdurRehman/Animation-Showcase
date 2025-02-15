window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingContent = document.querySelector(".loading-content");
  
  loadingContent.innerHTML = "<h1>Loaded!</h1>";
  setTimeout(() => { loadingScreen.style.opacity = 0 }, 750);


  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = window.innerWidth);
  const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

  let playerImage = document.getElementById("idle1");
  const player = { width: 799 * 0.5, height: 736 * 0.5, isMoving: false, isPunching: false, facingLeft: false };
  let imageToShow = 0;
  let animationToShow = 0;
  let gameFrame = 0;
  const startY = CANVAS_HEIGHT - player.height;
  let startX = 0;
  const frameStagger = 2;
  const spriteAnimations = [
    {
      name: "idle",
      frame: Array.from(
        { length: 20 },
        (_, i) => document.getElementById(`idle${i + 1}`)
      ),
    },
    {
      name: "punching",
      frame: Array.from(
        { length: 10 },
        (_, i) => document.getElementById(`punching${i + 1}`)
      ),
    },
    {
      name: "running",
      frame: Array.from(
        { length: 25 },
        (_, i) => document.getElementById(`running${i + 1}`)
      ),
    }
  ];

  function moveRight() {
    if (startX < CANVAS_WIDTH - player.width) {
      startX += 15;
      animationToShow = 2;
      player.isMoving = true;
      player.facingLeft = false;
    } else {
      animationToShow = 0;
      player.isMoving = false;
    }
  }

  function moveLeft() {
    if (startX) {
      startX -= 15;
      animationToShow = 2;
      player.isMoving = true;
      player.facingLeft = true;
    } else {
      animationToShow = 0;
      player.isMoving = false;
    }
  }

  function startPunching() {
    if (!player.isPunching) {
      animationToShow = 1;
      player.isPunching = true;
      player.isMoving = false;
    }
  }

  function stopPunching() {
    if (player.isPunching) {
      player.isPunching = false;
      if (player.isMoving) {
        animationToShow = 2;
      } else {
        animationToShow = 0;
      }
    }
  }

  window.addEventListener("keydown", event => {
    switch (event.key) {
      case "ArrowRight":
      case "D":
      case "d":
        moveRight();
        break;
      case "ArrowLeft":
      case "A":
      case "a":
        moveLeft();
        break;
      case "F":
      case "f":
        startPunching();
        return;
    }
  });

  window.addEventListener("keyup", () => {
    if (player.isMoving) {
      animationToShow = 0;
    } else {
      stopPunching();
    }
  })

  window.addEventListener("mousedown", event => {
    switch (event.button) {
      case 0:
        startPunching();
        break;
    }
  })

  window.addEventListener("mouseup", () => {
    stopPunching();
  })

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    if (player.facingLeft) {
      ctx.scale(-1, 1);
      ctx.drawImage(playerImage, -startX - player.width, startY, player.width, player.height);
    } else {
      ctx.drawImage(playerImage, startX, startY, player.width, player.height);
    }

    ctx.restore();

    const currentAnimation = spriteAnimations[animationToShow].frame;
    if (gameFrame % frameStagger === 0) {
      if (imageToShow < currentAnimation.length) {
        playerImage = currentAnimation[imageToShow];
        imageToShow++;
      } else {
        imageToShow = 0;
      }
    }
    
    gameFrame++;
    requestAnimationFrame(animate);
  }
  animate();
});