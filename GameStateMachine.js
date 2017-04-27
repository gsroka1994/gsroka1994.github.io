// Various game states
var waitingState = 0;
var setupState = 1;
var dealState = 2;
var cribState = 3;
var peggingState = 4;
var updateBoardState = 5;
var gameOver = 6;

// Supports only two players at the moment.  Will increase to 3 if time permits
var minPlayers = 2;
var maxPlayers = 2;

// Variables that will be used to keep track of game data throughout play
var p1Score = 0;
var p2Score = 0;
var dealer = 0;
var score;
var skunked = 0;
var winner = -1;  
var crib = [];
var cardsInCrib = 0;
var currentID = 0;
var playerIDs = [];
var pile = [];



 // Event Listener for when player (senders) become available
 gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_AVAILABLE,
    function(event) {
        console.log('Player is available');
    });
	

	// Same thing but for when Players become ready
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_READY,
  function(event) {
    var playerName = event.requestExtraMessageData.playerName;
    var playerId = event.playerInfo.playerId;
    console.log("Player Name: " + playerName + " is ready with id " + playerId);
    gameManager.updatePlayerData(playerId, {'name' : playerName}, false);
    var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
    gameManager.sendGameMessageToPlayer(playerId, readyPlayers);
  });
  

  // Main Listener that updates the states.  AKA:  The State Machine
gameManager.addEventListener(cast.receiver.games.EventType.GAME_MESSAGE_RECEIVED, function(event){
     var gamePhase = gameManager.getGameData().phase;
     
	 
	 
	 // Lobby State 
	 if(gamePhase == waitingState && event.requestExtraMessageData.startGame == "start") {

         // Ready the Readied Players
         var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);

         // Ensure that nobody is breaking our rules for player size
         if (!(readyPlayers.length < minPlayers || readyPlayers.length > maxPlayers)) {

             //If that's the case, the move those players from READY to PLAYING
             // The lobby is closed, as play is about to begin
             gameManager.updateLobbyState(cast.receiver.games.LobbyState.CLOSED, null, true);
             var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
             console.log("Game is Starting");

             for (var i = 0; i < readyPlayers.length; i++) {
                 var playerInfo = readyPlayers[i];
                 var playerId = playerInfo.playerId;
				 playerIDs[i] = playerId;
                 gameManager.updatePlayerState(playerId, cast.receiver.games.PlayerState.PLAYING, null, true);
             }

             // Update the gameData now that we have our players and the lobby state is complete
             // with the appropriate variables
             var gameData = gameManager.getGameData();
             init();
             gameData.deck_id = deckID;
             gameData.phase = setupState;
			 gameData.pile = pile;
             gameManager.updateGameData(gameData, false);
             console.log("Moving into setup phase.");
             gameData = gameManager.getGameData();
         }

     }
		
	// Setup State
	else if (gamePhase == setupState){
		p1Hand = [];
		p2Hand = [];
		crib = [];
		cardsInCrib = 0;
		pile = [];
		score = 0;
		dealer = !dealer;
		gameData.p1Hand = p1Hand;
		gameData.p2Hand = p2Hand;
		gameData.crib = crib;
		gameData.pile = pile;
		gameData.numCards = numCards;
		gameData.phase = dealState;
		gameManager.updateGameData(gameData, false);
		console.log("Moving into Deal State");
		gameData = gameManager.getGameData();
	}

	// Deal State
	else if (gamePhase == dealState && event.requestExtraMessageData == "deal"){
		deal();
		gameData.p1Hand = p1Hand;
		gameData.p2Hand = p2Hand;

		gameManager.sendGameMessageToPlayer(playerIDs[0], p1Hand);
		gameManager.sendGameMessageToPlayer(playerIDs[1], p2Hand);

		gameData.numCards = numCards;
		gameData.phase = cribState;
		console.log("Moving into Crib State");
		gameManager.updateGameData(gameData, false);
		gameData = gameManager.getGameData();
	}


	// Crib State
	else if(gamePhase == cribState && event.requestExtraMessageData.baby == "crib"){
		var player = event.playerInfo;
		var playerData = player.playerData;
		playerData.cribCards += 1;
		if(playerData.cribCards <= 2) {
            crib[cardsInCrib] = event.requestExtraMessageData;
            gameData.crib = crib;
            cardsInCrib++;
        }
		if (cardsInCrib >= 4) {
            gameData.phase = peggingState;
            console.log("Moving into Pegging State");
        }
		gameManager.updateGameData(gameData, false);
		gameData = gameManager.getGameData();
	}

	// Pegging State
	else if (gamePhase == peggingState && event.requestExtraMessageData.phase == "peg"){
		if(event.requestExtraMessageData.datBoi == "p1"){
			if(event.requestExtraMessageData.go == "yes"){
				peg("p2", 1);
			}
			else {
				pile[pile.size] = event.requestExtraMessageData;
                score = scorePegging(pile);
                p1Score += score;
                peg("p1", p1Score + score);
                gameData.p1Score = p1Score + score;
            }
		}

		else if(event.requestExtraMessageData.datBoi == "p2"){
			if(event.requestExtraMessageData.go == "yes"){
				peg("p1", 1);
			}
			else {
                pile[pile.size] = event.requestExtraMessageData;
                score = scorePegging(pile);
                p2Score += score;
                peg("p2", p2Score + score);
                gameData.p2Score = p2Score + score;
            }
		}
		
		else {

		}

		if (pile.size >= 8){
            gameData.phase = updateBoardState;
            console.log("Moving into Update Board State");
		}
	  gameManager.updateGameData(gameData, false);
	  gameData = gameManager.getGameData();
	}

	// Update Board State
	else if(gamePhase == updateBoardState){
		// Stuff for scoring hands (received from sender)
			

		// Stuff for board movement
		

		// Make a checkWinner function



		// Reshuffle the deck
		shuffle();
		gameData.p1Score = p1Score;
		gameData.p2Score = p2Score;
		if(winner > 0){
			gameData.phase = gameOver;
			console.log("Moving into Game Over")
		}
		else {
			gameData.phase = setupState;
			console.log("Moving back to Setup");
		}
	  gameManager.updateGameData(gameData, false);
	  gameData = gameManager.getGameData();
	}

	// Game Over State
	else if (gamePhase == gameOver){

		// Write a function that displays something for winning

	}

	// Ignore any events not pertaining to a specific state of the game
	else {}
});
	 
//  Event listeners for players that quit or are disconnected by accident (server's fault)
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_QUIT);
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_DROPPED);



