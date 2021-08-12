let gameOn;
let dicesRolled = [];
let currentPlayers = [1, 2];  // Default starts with 2 dices/players

// Audio
const diceSound = new Audio('audio/diceSound.mp3');
const winSound = new Audio('audio/winSound.mp3');


/* ----- PREPARE DICE SET ----- */

// General components not displayed at start
document.querySelector('.remove-btn').style.visibility = "hidden";
document.querySelector('.add-btn').style.visibility = "hidden";
document.querySelector('.dice-container').style.display = "none";
document.querySelector('.roll-btn').style.visibility = "hidden";
document.querySelector('.again-btn').style.display = "none";

// If chose roll dices only, display general components & undisplay game components and set gameOn false
function noGameVersion() {
  document.querySelector('.remove-btn').style.visibility = "initial";
  document.querySelector('.add-btn').style.visibility = "initial";
  document.querySelector('.dice-container').style.display = "initial";
  document.querySelector('.roll-btn').style.visibility = "initial";
  document.querySelector('.version-btns').style.display = "none";
  document.querySelector('.main-title').innerHTML = "Roll On!";
  document.querySelector('.player1').style.visibility = "hidden";
  document.querySelector('.player2').style.visibility = "hidden";

  gameOn = false;
}

// If chose dice game, display game components and set gameOn true
function gameVersion() {
  document.querySelector('.remove-btn').style.visibility = "initial";
  document.querySelector('.add-btn').style.visibility = "initial";
  document.querySelector('.dice-container').style.display = "initial";
  document.querySelector('.roll-btn').style.visibility = "initial";
  document.querySelector('.version-btns').style.display = "none";
  document.querySelector(".main-title").innerHTML = "Game On!";

  gameOn = true;
}

function addDice() {
  if (currentPlayers.length < 10) {
    currentPlayers.push(currentPlayers.length + 1);

    // Create new div-element and add two classes
    const dice = document.createElement('div');
    dice.classList.add('dice' + currentPlayers.length, 'dice');
    document.querySelector('.dice-container').appendChild(dice);

    // Create/append paragraph & text to new dice
    const player = document.createElement('P');
    const playerText = document.createTextNode('Player ' + currentPlayers.length);
    player.classList.add('player' + currentPlayers.length, 'player');
    player.appendChild(playerText);
    document.querySelector('.dice' + currentPlayers.length).appendChild(player);

    // Create/append image to new dice
    const image = document.createElement('img');
    image.setAttribute('class', 'img' + currentPlayers.length);
    image.setAttribute('src', 'images/dice6.png');
    document.querySelector('.dice' + currentPlayers.length).appendChild(image);

    // Hide player number, if not playing game
    if (!gameOn) {
      document.querySelector('.player' + currentPlayers.length).style.visibility = "hidden";
    }
  }
}

function removeDice() {
  if ((gameOn && currentPlayers.length > 2) || (!gameOn && currentPlayers.length > 1)) {
    document.querySelector('.dice' + currentPlayers.length).remove();
    currentPlayers.pop();
  }
}

/* ----- ROLLING DICES ----- */

function refresh() {
  diceSound.play();

  if (gameOn) {
    // Hide add-btn & remove-btn
    document.querySelector('.remove-btn').style.visibility = "hidden";
    document.querySelector('.add-btn').style.visibility = "hidden";
  }

  // Set interval for multiple dice rolls per player and round; loopCount to limit rolls
  let loopCount = 0;
  let rollsPerRound = 4;

  const myInterval = setInterval(function () {
    dicesRolled = [];
    rollDice();
  }, 150);

  function rollDice() {
    currentPlayers.forEach(i => {
      console.log(i);
      const rolledNum = Math.floor(Math.random() * 6) + 1;
      const numImage = 'images/dice' + rolledNum + '.png';

      // Remove current dice's p and img
      document.querySelector('.player' + i).remove()
      document.querySelector('.img' + i).remove()

      // Create/append NEW paragraph & text to new dice
      const player = document.createElement('P');
      const playerText = document.createTextNode('Player ' + i);
      player.classList.add('player' + i, 'player');
      player.appendChild(playerText);
      document.querySelector('.dice' + i).appendChild(player);

      // Create/append NEW image to new dice
      const image = document.createElement('img');
      image.setAttribute('class', 'img' + i);
      image.setAttribute('src', numImage);
      document.querySelector('.dice' + i).appendChild(image);

      // Store player's dice as obj, then push it into the dedicated empty list
      rollObj = { player_id: i, diceRoll: rolledNum };
      dicesRolled.push(rollObj);

      // If game not on, hide player number
      if (!gameOn) {
        document.querySelector('.player' + i).style.visibility = "hidden";
      }
    });

    // At certain loopCount clear interval, i.e. stop dice roll for current round
    loopCount++;
    console.log("loopcount " + loopCount);
    for (let i = 0; i < dicesRolled.length; i++) {
      console.log("curr i: " + i);
      console.log("play " + dicesRolled[i].player_id);
      console.log("roll " + dicesRolled[i].diceRoll);
    }

    // Stop dice rolls for curent round and check winner if gameon
    if (loopCount >= rollsPerRound) {
      clearInterval(myInterval);
      if (gameOn && dicesRolled.length > 0) {
        setTimeout(function () { checkWinner() }, 200);
      }
    }
  }

  function checkWinner() {
    // Check for highest dice roll
    let tempHighest = 0;
    for (let i = 0; i < currentPlayers.length; i++) {
      if (dicesRolled[i].diceRoll > tempHighest) {
        tempHighest = dicesRolled[i].diceRoll;
      }
    }

    // Deal with player(s) that didn't get highest dice roll
    for (let i = 0; i < dicesRolled.length; i++) {
      if (dicesRolled[i].diceRoll < tempHighest) {
        document.querySelector('.dice' + dicesRolled[i].player_id).classList.remove('dice' + dicesRolled[i].player_id);

        // Change their opacity and remove current dice's p and img classes
        document.querySelector('.player' + dicesRolled[i].player_id).style.opacity = 0.7;
        document.querySelector('.player' + dicesRolled[i].player_id).classList.remove('player' + dicesRolled[i].player_id);
        document.querySelector('.img' + dicesRolled[i].player_id).style.opacity = 0.15;
        document.querySelector('.img' + dicesRolled[i].player_id).classList.remove('img' + dicesRolled[i].player_id);

        // Delete them from list of current players
        const findCurrentIndex = currentPlayers.indexOf(dicesRolled[i].player_id);
        currentPlayers.splice(findCurrentIndex, 1);
      }
    }

    // If more than one player got highest dice roll, name them for next round
    let nextRoundPlayers = "";
    if (currentPlayers.length > 1) {
      for (let i = 0; i < currentPlayers.length; i++) {
        nextRoundPlayers += ' &nbsp ' + currentPlayers[i] + ',';
      }

      document.querySelector('.main-title').innerHTML =
        "Players to next round: Player " + nextRoundPlayers.replace(/.$/, ".");

      // When only one player left, name and celebrate the winner
    } else if (currentPlayers.length == 1) {
      document.querySelector('.main-title').innerHTML = "Winner is Player &nbsp" + currentPlayers[0] + " !";
      document.querySelector('.main-title').style.color = 'rgb(176, 255, 255)';

      // Add animation class to winning player & play winning sound
      document.querySelector('.img' + currentPlayers[0]).classList.add('winner');
      winSound.play();

      // Undisplay roll-button & display play-again-button
      document.querySelector('.roll-btn').style.display = "none";
      document.querySelector('.again-btn').style.display = "initial";
    }
  }

  // Empty the list of rolled dices before next round
  dicesRolled = [];
}

function playAgain() {
  setTimeout(function () { document.location.href = ''; }, 500);
}




