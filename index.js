let gameOn;

document.querySelector('.dice-container').style.visibility = "hidden";
document.querySelector('.btn').style.visibility = "hidden";

// If just want to roll dices, don't display game components and set gameOn false
function noGameVersion() {
  document.querySelector('.dice-container').style.visibility = "initial";
  document.querySelector('.btn').style.visibility = "initial";
  document.querySelector('.version-btns').style.display = "none";
  document.querySelector(".main-title").innerHTML = "Roll On!";
  document.querySelector(".playerNum1").innerHTML = "";
  document.querySelector(".playerNum2").innerHTML = "";

  gameOn = false;
}

// If want to play dice game, display game components and set gameOn true
function gameVersion() {
  document.querySelector('.dice-container').style.visibility = "initial";
  document.querySelector('.btn').style.visibility = "initial";
  document.querySelector('.version-btns').style.display = "none";
  document.querySelector(".main-title").innerHTML = "Game On!";

  gameOn = true;
}

//refresh on roll-button click, and if gameOn is true >> name the winner 
function refresh() {
  var player1Dice = Math.floor(Math.random() * 6) + 1;
  var player2Dice = Math.floor(Math.random() * 6) + 1;

  var imagePlayer1 = "images/dice" + player1Dice + ".png";
  var imagePlayer2 = "images/dice" + player2Dice + ".png";

  document.querySelector(".img1").setAttribute("src", imagePlayer1);
  document.querySelector(".img2").setAttribute("src", imagePlayer2);

  if (gameOn) {
    if (player1Dice === player2Dice) {
      document.querySelector(".main-title").innerHTML = "Draw!";
    } else if (player1Dice > player2Dice) {
      document.querySelector(".main-title").innerHTML = "Player 1 wins!";
    } else {
      document.querySelector(".main-title").innerHTML = "Player 2 wins!";
    }
  }
}

//comment ust to make a branch