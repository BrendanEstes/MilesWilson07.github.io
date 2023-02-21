const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 3;
var ballSpeed = 2.5;

let mSound1 = new Audio('tennis-smash-100733.mp3');
let mSound2 = new Audio('high-zcore-96686.mp3');
let mSound3 = new Audio('videogame-death-sound-43894.mp3');
const maxPaddleX = 600;

var player1Score = 0;
var player2Score = 0;
context.fillText(
  "The score is " + player1Score + " to " + player2Score,
  500,
  100
);


const leftPaddle = {
  // start in the middle of the game on the left side
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  name: "Computer",
  color: "white",
  // paddle velocity
  dy: 0,
};
const rightPaddle = {
  // start in the middle of the game on the right side
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  name: "",
  color: "",
  // paddle velocity
  dy: 0,
  // new - to set x velocity as 0 at first
  dx: 0

};
const ball = {
  // start in the middle of the game
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  // keep track of when need to reset the ball position
  resetting: false,

  // ball velocity (start going to the top-right corner)
  dx: ballSpeed,
  dy: -ballSpeed,
};

// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function gameOver() {
  var modal = document.getElementById("overModal");
  modal.style.display = "block";
  var button = document.getElementById("startBtn");
}

function startOver() {
  location.reload();
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move paddles by their velocity
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // new - used to move right paddle by x velocity
  rightPaddle.x += rightPaddle.dx;



  // prevent paddles from going through walls
  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  } else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  } else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }




// new - used to stop paddle from going too far left or right
 if (rightPaddle.x > 730) {
    rightPaddle.x = 730;
  }
  
  if (rightPaddle.x < maxPaddleX) {
    rightPaddle.x = maxPaddleX;
  }





  // draw paddles
  context.fillStyle = "white";
  context.fillRect(
    leftPaddle.x,
    leftPaddle.y,
    leftPaddle.width,
    leftPaddle.height
  );
  context.fillStyle = rightPaddle.color;
  context.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );

  // move ball by its velocity
  ball.x += ball.dx;
  ball.y += ball.dy;

  // move left paddle based on velocity of ball
  if (ball.dy < 0) {
    leftPaddle.dy = -paddleSpeed * 0.88;
  } else if (ball.dy > 0) {
    leftPaddle.dy = paddleSpeed * 0.88;
  }

  // prevent ball from going through walls by changing its velocity
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
  } else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
  }

  // reset ball if it goes past paddle (but only if we haven't already done so)

  if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    if(ball.x < 0)
    {
      mSound2.play();
      player2Score++;

       // new - used to adjust speed based on how good player is doing.
      if (player2Score % 2 == 0 && player2Score != 0) {
	 paddleSpeed = paddleSpeed + paddleSpeed * .15;
 	ballSpeed = ballSpeed + ballSpeed * .15;
	 ball.dx = ballSpeed;
	 ball.dy = -ballSpeed;
	}



    }

if(ball.x > canvas.width)
    {
      mSound2.play();
      player1Score++;
	
	// new - used to adjust speed based on how bad player is doing.
        if (player1Score % 2 == 0 && player1Score != 0) {
	 paddleSpeed = paddleSpeed - paddleSpeed * .15;
 	ballSpeed = ballSpeed - ballSpeed * .15;
	 ball.dx = ballSpeed;
	 ball.dy = -ballSpeed;
	}

    }
  
    
    document.getElementById("computer-score").innerText =player1Score
    document.getElementById("rightPlayer-score").innerText =player2Score
    
    ball.resetting = true;

// stop if score past 7
if (player2Score >= 7 || player1Score >= 7) {
	ball.dy = 0;
	leftPaddle.dy = 0;
	rightPaddle.dy = 0;
  mSound3.play();
	return gameOver();
}

    // give some time for the player to recover before launching the ball again
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 400);
  }

  // check to see if ball collides with paddle. if they do change x velocity
  if (collides(ball, leftPaddle)) {
    mSound1.play();
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = leftPaddle.x + leftPaddle.width;

  }
  else if (collides(ball, rightPaddle)) {
    mSound1.play();

    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = rightPaddle.x - ball.width;
  }

  // draw ball
  // changed ball clor to white need to be fix after merge//
  context.fillStyle="lightgrey"
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // draw walls
  context.fillStyle = "lightgrey";
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // draw dotted line down the middle
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }


 // new -  draw dotted line at ~600 to limit paddle horizontal movement
 for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(590, i, 10, 10);
  }



}

// listen to keyboard events to move the paddles
document.addEventListener("keydown", function (e) {
  // up arrow key
  if (e.which === 38) {
    rightPaddle.dy = -paddleSpeed;
  }
  // down arrow key
  else if (e.which === 40) {
    rightPaddle.dy = paddleSpeed;
  }

  // new - used for left and right arrows
  if (e.which === 37) {
    rightPaddle.dx = -paddleSpeed;
  }
  else if (e.which === 39) {
    rightPaddle.dx = paddleSpeed;
  }

});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener("keyup", function (e) {
  if (e.which === 38 || e.which === 40) {
    rightPaddle.dy = 0;
  }

  if (e.which === 83 || e.which === 87) {
    leftPaddle.dy = 0;
  }


  // new - used to check for left and right arrows
  if (e.which === 37 || e.which === 39) {
    rightPaddle.dx = 0;
  }


});

// start the game
document.querySelector("#play").addEventListener("click", function (e) {
  rightPaddle.name = document.querySelector("#name").value;
  if (rightPaddle.name=="") {
    rightPaddle.name="Player 2"
  }
  document.getElementById("name-player").innerText =rightPaddle.name+": "

  document.querySelector(".start-game").style.display = "none";
  document.querySelector(".row").style.display = "block";
  requestAnimationFrame(loop);
});

document.querySelectorAll(".colors button").forEach(function (item) {
  item.addEventListener("click", function (e) {
    console.log(e.target);
    rightPaddle.color = e.target.className;
  });
});
