////////////// Preload Resources: images & sounds /////////////

// Images
var imgRoach = new Image();
imgRoach.src = 'assets/roachRight.png';

var imgSplat = new Image();
imgSplat.src = 'assets/splat.png';

var imgHand = new Image();
imgHand.src = 'assets/hand.png';

var imgBackground = new Image();
imgBackground.src = 'assets/splat.png';

var audioKill = new Audio('assets/Kill.mp3');

/////////////// Global Variables /////////////

// programmer defined variables to adjust game parameters
var numRoaches = 100;
var maxRoachSpeed = 15;
var minRoachSpeed = 1;
var startRadius = 25;
var numPlayers = 3;

// UI related globals
var canvas;
var ctx;
var canvasWidth = 600; // from CSS file ...make this adjustable in future?
var canvasHeight = 400; // from CSS file ...make this adjustable in future?
var timeoutId;

// Game control globals
var theSplats = [];
var roaches = [];
var thePlayers = [];
var currentPlayerIndex = 0;
var currentPlayer;


//////////////// Constructors ////////////////

// Spat constructor
var splat = function (xPos, yPos) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.eraseSplat = function() {
    ctx.clearRect(this.xPosOld, this.yPosOld, imgSplat.width, imgSplat.height);
  };
  this.renderSplat = function() {
    ctx.drawImage(imgSplat, this.xPos, this.yPos);
  };
}

// Roach constructor
var roach = function (xPos, yPos, xVel, yVel) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.xPosOld = xPos;
  this.yPosOld = yPos;
  this.xVel = xVel;
  this.yVel = yVel;
  this.moveIt = function() {
    // save old position & update position
    this.xPosOld = this.xPos;
    this.xPos = this.xPos + this.xVel;
    this.yPosOld = this.yPos;
    this.yPos = this.yPos + this.yVel;
  };
  this.eraseRoach = function() {
    ctx.clearRect(this.xPosOld, this.yPosOld, imgRoach.width, imgRoach.height);
  }
  this.render = function() {
//      ctx.fillRect(this.xPos, this.yPos, 40, 40);
    ctx.drawImage(imgRoach, this.xPos, this.yPos);
  };
  this.changeVelocity = function() {
    // Future feature in new version
    // make roaches respond to mouse proximity
  };
  this.inboudsQuery = function() {
    if (  ( this.xPos > canvasWidth ) ||
          ( this.xPos < (0 - imgRoach.width)) ||
          ( this.yPos > canvasHeight ) ||
          ( this.yPos < (0 - imgRoach.height))  ) {
      return false;
    }
    else {
      return true;
    }
  };
}

// Make new player
var player = function(index) {
  this.name = "Dood" + (index + 1); // for now players will be called "Dood 1", "Dood 2", etc
  this.currentKills = 0;
  this.totalKills = 0; // current kills on this level
  this.levelsWon = 0;
  this.xPos;
  this.yPos;
  this.xPosOld;
  this.yPosOld;

  this.mouseMove = function(event) {
    console.log('mouse Move:' + this + this.xPos + ", " + this.yPos);

    // clear hand at old postion
    this.clearPlayer();
    // ctx.clearRect(this.xPosOld, this.yPosOld, 40, 40);

    // store current position of mouse
    this.xPos = event.pageX - canvas.offsetLeft;
    this.yPos = event.pageY - canvas.offsetTop;

    // save old position so we can clear it before changing this.x & y
    this.xPosOld = this.xPos;
    this.yPosOld = this.yPos;
  };
  this.render = function() {
    console.log('render:' + this + this.xPos + ", " + this.yPos);
    ctx.drawImage(imgHand, this.xPos, this.yPos );
  };
  this.clearPlayer = function() {
    ctx.clearRect(this.xPosOld, this.yPosOld, 40, 40);
  }
  this.killRoaches = function(event) {
    console.log('killRoaches: ' + this + this.xPos + ", " + this.yPos);
    var xKill = event.pageX - canvas.offsetLeft;
    var yKill = event.pageY - canvas.offsetTop;
    console.log('trying to kill roaches');
    console.log(event.pageX + ", " + event.pageY + "  " +
      xKill + ', ' + yKill);

    // check for kills on each roach
    for (i=0; i<roaches.length; i++) {
      if (
            (xKill > (roaches[i].xPos - imgHand.width)) &&
            (xKill < (roaches[i].xPos + imgRoach.width)) &&
            (yKill > (roaches[i].yPos - imgHand.height)) &&
            (yKill < (roaches[i].yPos + imgHand.height))
                                                              ) {
          // Killed a roach! Increase score
          this.currentKills= this.currentKills + 1;
          // audioKill.stop();
          audioKill.play();

          // clear roach from canvass draw splat and remove roach from array
          console.log('KILLED A ROACH!  There were ' + roaches.length + ' roaches.');
          roaches[i].eraseRoach();

          // draw a splat
          // ctx.drawImage(imgSplat, roaches[i].xPos, roaches[i].yPos);
          // add a splat object
          var theSplat = new splat(roaches[i].xPos, roaches[i].yPos);
          theSplats.push(theSplat);

          roaches.splice(i, 1);
          console.log('Now there are ' + roaches.length + ' roaches.');
          // stop rendering if all roaches dead
          if (roaches.length == 0 ) {
            endTurn();
          }
        } // close met kill conditions
      } // close for loop to check all roaches
  }; // close this.killRoaches()
} // close player() constructor

////////////////  Helper Functions /////////////////

function renderGame() {
  // console.log('rendering Game');

  // Draw the splats (future feature)
  for (var i=0; i<theSplats.length; i++) {
    theSplats[i].renderSplat();
  }
  // change roach position and remove from array if escapes (out of bounds)
  for (var i=0; i<roaches.length; i++) {
    roaches[i].moveIt();
    roaches[i].eraseRoach();
    var inbounds = roaches[i].inboudsQuery()
    if (inbounds==false) {
      roaches.splice(i, 1);
    }
  }

  // end the turn if no more roaches
  if (roaches.length == 0) {
    endTurn();
  }

  // Draw the roaches
  for (var i=0; i<roaches.length; i++) {
    roaches[i].render();
  }

  // Draw the player
  currentPlayer.render();
}

function doPlayerTurn() {
  if (currentPlayerIndex < numPlayers) {
    // Create the roaches with initial random positions & velcities

    // *** TEST CODE BELOW REMOVE THIS TEST CODE *** //
    //numRoaches = parseInt( Math.random() * 6 + 1 );
    //numRoaches = numRoaches + 2;
    // *** TEST CODE ABOVE REMOVE THIS TEST CODE *** //

    $('#gameStatusMsg').empty();
    $('#gameStatusMsg').show();
    $('#gameStatusMsg').append(currentPlayer.name + ', click on roaches to squash them!');
    $('#gameStatusMsg').fadeOut(3000);

    // clear splats
    theSplats = [];

    for (var i=0; i<numRoaches; i++) {
      console.log('creating Roach ' + i);
      // choose random position within 50px of center
      var x = Math.floor(
        Math.random() * (  ((canvasWidth/2 + startRadius)+1) - (canvasWidth/2 - startRadius)  )
        + (canvasWidth/2 - startRadius - imgRoach.width/2)
      );
      var y = Math.floor(
        Math.random() * (  ((canvasHeight/2 + startRadius)+1) - (canvasHeight/2 - startRadius)  )
        + (canvasHeight/2 - startRadius - imgRoach.height/2)
      );

      // choose random velocity from +/-maxRoachSpeed
      var xVel = Math.floor(
        Math.random() * ((maxRoachSpeed+1) - minRoachSpeed) + minRoachSpeed
        - maxRoachSpeed/2
      );
      var yVel = Math.floor(
        Math.random() * ((maxRoachSpeed+1) - minRoachSpeed) + minRoachSpeed
        - maxRoachSpeed/2
      );
      roaches[i] = new roach(x, y, xVel, yVel);
    }

    // listen for player events  CHECK OUT THIS ISSUE!!!  'this' issue fixed!!!
    /* The following code doesn't work.  event handling doesn't work this way because 'this' in currentPlayer.killRoaches will refer to the canvas (the calling object) and the instance of my object 'currentPlayer'.
    canvas.addEventListener('click', currentPlayer.killRoaches);
    canvas.addEventListener('mousemove', currentPlayer.mouseMove);
    */

    // values of handler functions before setting them (initial value)
    console.log("canvas.onlick: " + canvas.onclick);
    console.log("canvas.onmousemove: " + canvas.onmousemove);
    canvas.onclick = function(event) {
      console.log('--click-- currentPlayer:' + currentPlayer.xPos + ', ' + currentPlayer.yPos);
      currentPlayer.killRoaches(event);
    }
    canvas.onmousemove = function(event) {
      console.log('--mouseMove-- currentPlayer:' + currentPlayer.xPos + ', ' + currentPlayer.yPos);
      currentPlayer.mouseMove(event);
    }

    // listen for ESC to stop the program
    $( "html" ).keydown(function( event ) {
      // ESC - stop the roach!
      if (event.keyCode == 27) {
        clearInterval(timeoutId);
      }
      console.log('event.keyCode: ' + event.keyCode);
    });

    // set game rendering in motion
    timeoutId = window.setInterval(renderGame, 50);
  } // close condition (still have players to go through)

  else {
    // check who won and display here
    var winningScore = -1;
    var tie = false;
    var scoreString = "";
    var winString = "";
    // check for Winning score or tie
    for (var i=0; i < thePlayers.length; i++) {
      if ( thePlayers[i].currentKills > winningScore ) {
        winningScore = thePlayers[i].currentKills;
        tie = false;
      }
      else if ( thePlayers[i].currentKills == winningScore ) {
        tie = true;
      }

      // add to player's score for round to display string
      scoreString = scoreString + thePlayers[i].name + ": " + thePlayers[i].currentKills + " kills.\n";
    }

    if (tie) {
      for (var i=0; i < thePlayers.length; i++) {
        if ( thePlayers[i].currentKills == winningScore ) {
          scoreString = scoreString + thePlayers[i].name + " "
        }
      }
      scoreString = scoreString + " tied.\n\n";
    }
    else {
      // this unecessarily loops though all players.  maybe an better solution
      for (var i=0; i < thePlayers.length; i++) {
        if ( thePlayers[i].currentKills == winningScore) {
          winString = winString + thePlayers[i].name + " wins!!!\n\n";
        }
      }
    }
    scoreString = scoreString + 'GAME OVER DOODS! Call the exterminator next time!';

    // * display winner but wait for last player score to stop displaying
    window.setTimeout(function(){
      $('#gameStatusMsg').empty();
      $('#gameStatusMsg').show();
      $('#gameStatusMsg').append(winString);
      for (var i=0; i<10; i++) {
        $('#gameStatusMsg').fadeOut(300);
        $('#gameStatusMsg').fadeIn(300);
      }
    }, 2200);

    window.setTimeout(function(){
      $('#gameStatusMsg').empty();
      $('#gameStatusMsg').show();
      $('#gameStatusMsg').append(scoreString);
    }, 2200+600*10+500);

  }
} // close doPlayerTurn()

function endTurn() {
  console.log('All roaches dead or escaped!');
  $('#gameStatusMsg').empty();
  $('#gameStatusMsg').show();
  $('#gameStatusMsg').append(thePlayers[currentPlayerIndex].name + ' killed ' + currentPlayer.currentKills + ' roaches this round!');
  $('#gameStatusMsg').fadeOut(2200);
  // alert(thePlayers[currentPlayerIndex].name + ' killed ' + currentPlayer.currentKills + ' roaches this round!');
  clearTimeout(timeoutId);
  // clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // *** is it valid to remove event handlers this way?
  canvas.onclick = null;
  canvas.onmousemove = null;
  currentPlayer.totalKills = currentPlayer.totalKills + currentPlayer.currentKills;
  currentPlayerIndex++;
  currentPlayer = thePlayers[currentPlayerIndex];
  doPlayerTurn();
}

////////////////////////////////////////////////////////////
////////////////// START DOING STUFF HERE! /////////////////

///////// Initialize global objects /call construtors //////////

// Create players (aka da playaz)
for (var i=0; i<numPlayers; i++) {
  console.log('Creating player: ' + i);
  thePlayers[i] = new player(i);
}
// set to player1's turn
currentPlayer = thePlayers[0];

////////////////////// window.onload //////////////////////////

$('document').ready(function(){
  console.log('window loaded');

  canvas = document.getElementById('gameCanvas');
  // canvas = document.getElementById('gameCanvas').style.cursor = "none";
  ctx = canvas.getContext('2d');

  // Selectors
  var gameStatusMsg = $('#statusMsg');
  console.log(gameStatusMsg);
  /////// MAIN CONTROL CODE ///////////////////
  /////////////////////////////////////////////
  var background = new Image();
  background.src = document.location.href + 'assets/woodGrain.jpg';

  console.log(document.location.href + 'assets/woodGrain.jpg');

  background.onload = function() {
    // background.width = canvasWidth;
    // background.height = canvasHeight;
    // ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    doPlayerTurn();
  };
}); // close $('document').ready()
