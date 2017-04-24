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

// Variables that will be used to keep track of game data thoughout play
var currentState = -1;  
var numberOfPlayers = 0;
var p1Peg1 = 0;
var p1Peg2 = -1;
var p2Peg1 = 0;
var p2Peg2 = -1;
var skunked = 0;
var winner = -1;  
var crib = [];
var playerIDs = [];
var pile = [];

// Opens lobby for sender apps and updates game data to reflect current state
 gameManager.updateLobbyState(cast.receiver.games.LobbyState.OPEN);
 gameManager.updateGameData({'phase' : waitingState}, false); 

 // Event Listener for when player (senders) become available
 gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_AVAILABLE,
    function(event) {
        console.log('Player ' + event.playerInfo.playerId + ' is available');
    });
	
	
	// Same thing but for when Players become ready
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_READY,
  function(event) {
    var playerName = event.requestExtraMessageData.playerName;
    var playerId = event.playerInfo.playerId;
    console.log("Player Name: " + playerName + " is ready with id " + playerId);
    gameManager.updatePlayerData(playerId, {'name' : playerName}, false);
  });
  
  
  // Main Listener that updates the states.  AKA:  The State Machine
gameManager.addEventListener(cast.receiver.games.EventType.GAME_MESSAGE_RECEIVED, function(event){
      gamePhase = gameManager.getGameData().phase;
     
	 
	 
	 // Lobby State 
	 if(gamePhase == waitingState && event.requestExtraMessageData.start == "true") {

         // Ready the Readied Players
         var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);

         // Ensure that nobody is breaking our rules for player size
         if (!(readyPlayers.length < minPlayers || readyPlayers.length > maxPlayers)) {

             //If that's the case, the move those players from READY to PLAYING
             // The lobby is closed, as play is about to begin
             gameManager.updateLobbyState(cast.receiver.games.LobbyState.CLOSED, null, true);
             var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
             document.getElementById("playerList").innerHTML = event.playerInfo.playerData.name + " is setting up the game";

             for (var i = 0; i < readyPlayers.length; i++) {
                 var playerInfo = readyPlayers[i];
                 var playerId = playerInfo.playerId;
				 playerIDs[i] = playerID;
                 gameManager.updatePlayerState(playerId, cast.receiver.games.PlayerState.PLAYING, null, true);
             }

             // Update the gameData now that we have our players and the lobby state is complete
             // with the appropriate variables
             var gameData = gameManager.getGameData();
             init();
             gameData.deck_id = deckID;
             gameData.phase = setupState;
			 gameData.pile = pile;
             gameData.p1Peg1 = p1Peg1;
             gameData.p1Peg2 = p1Peg2;
             gameData.p2Peg1 = p2Peg1;
             gameData.p2Peg2 = p2Peg2;
             gameManager.updateGameData(gameData, false);
             console.log("Moving into setup phase.");
             gameData = gameManager.getGameData();
         }

     }
		
	// Setup State
	else if (gamePhase == setupState){

		// Write a function that clears hands and crib variables
		clearNewTurn();
		gameData.p1Hand = p1Hand;
		gameData.p2Hand = p2Hand;
		gameData.crib = crib;
		gameData.numCards = numCards;

		gameData.phase = dealState;
		gameManager.updateGameData(gameData, false);
		console.log("Moving into Deal State");
		gameData = gameManager.getGameData();
	}

	// Deal State
	else if (gamePhase == dealState && event.requestExtraMessageData.readyToDeal == "true"){
		deal();
		gameData.p1Hand = p1Hand;
		gameData.p2Hand = p2Hand;
		for (i = 0, i < p1Hand.length; i++){
			gameManager.sendGameMessageToPlayer(playerIDs[0], p1Hand[i]);
		}
		for (i = 0, i < p2Hand.length; i++){
			gameManager.sendGameMessageToPlayer(playerIDs[1], p2Hand[i]);
		}
		gameData.numCards = numCards;
		gameData.phase = cribState;
		console.log("Moving into Crib State");
		gameManager.updateGameData(gameData, false);
		gameData = gameManager.getGameData();
	}


	// Crib State
	else if(gamePhase == cribState){
		gameData.crib = crib;
		gameData.phase = peggingState;
		console.log("Moving into Pegging State");
		gameManager.updateGameData(gameData, false);
		gameData = gameManager.getGameData();
	}

	// Pegging State
	else if (gamePhase == peggingState){
		if(event.requestExtraMessageData.p1Peg == "true"){
			peg("p1", score);	
			gameData.p1Peg1 = p1Peg1;
			gameData.p1Peg2 = p1Peg2;
		}

		else if(event.requestExtraMessageData.p2Peg == "true"){
			peg("p2", score);
			gameData.p2Peg1 = p2Peg1;
			gameData.p2Peg2 = p2Peg2;
		}
		
		else {
			gameData.phase = updateBoardState;
			console.log("Moving into Update Board State");
		}
		
	  gameManager.updateGameData(gameData, false);
	  gameData = gameManager.getGameData();
	}

	// Update Board State
	else if(gamePhase == updateBoardState && event.requestExtraMessageData.peggingDone == "true"){
		// Stuff for scoring hands
			

		// Stuff for board movement
		

		// Make a checkWinner function


		// Reshuffle the deck
		shuffle();
		gameData.p1Peg1 = p1Peg1;
		gameData.p1Peg2 = p1Peg2;
		gameData.p2Peg1 = p2Peg1;
		gameData.p2Peg2 = p2Peg2;
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
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_QUIT, displayQuitPlayers);
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_DROPPED, displayQuitPlayers);

