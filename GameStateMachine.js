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
var p1Hand = {
			card1: "",
    		card2: "",
    		card3: "",
    		card4: "",
    		card5: "",
    		card6: "",

};
var p2Hand = {
    card1: "",
    card2: "",
    card3: "",
    card4: "",
    card5: "",
    card6: "",

};
var gameData;
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
var playersTobeSent = [];
var ready = {
		player1: "",
		player2: ""
};
var k;
var playerNames = [];



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
    for (var i = 0; i < readyPlayers.length; i++){
    	if ( i == 0){
    		ready.player1 = readyPlayers[i].playerData.name;
		}
		if (i == 1){
            ready.player2 = readyPlayers[i].playerData.name;
		}
	}
	for (var j = 0; j < readyPlayers.length; j++) {
        gameManager.sendGameMessageToPlayer(readyPlayers[j].playerId, ready);
    }
  });
  

  // Main Listener that updates the states.  AKA:  The State Machine
gameManager.addEventListener(cast.receiver.games.EventType.GAME_MESSAGE_RECEIVED, function(event){
     var gamePhase = gameManager.getGameData().phase;
     
	 
	 
	 // Lobby State 
	 if(gamePhase == waitingState && event.requestExtraMessageData.startGame == "start") {

         document.getElementById("gameStateDisplayHeader").innerHTML = "Game is Starting..";

         // Ready the Readied Players
         var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);

         // Ensure that nobody is breaking our rules for player size
         if (!(readyPlayers.length < minPlayers || readyPlayers.length > maxPlayers)) {

             //If that's the case, the move those players from READY to PLAYING
             // The lobby is closed, as play is about to begin
             gameManager.updateLobbyState(cast.receiver.games.LobbyState.CLOSED, null, true);
             var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
             gameManager.sendGameMessageToAllConnectedPlayers({ startGame: "start" });
             console.log("Game is Starting");

             for (var i = 0; i < readyPlayers.length; i++) {
                 var playerInfo = readyPlayers[i];
                 var playerId = playerInfo.playerId;
				 playerIDs[i] = playerId;
				 playerNames[i] = playerInfo.playerData.name;
                 gameManager.updatePlayerState(playerId, cast.receiver.games.PlayerState.PLAYING, null, true);
             }

             // Update the gameData now that we have our players and the lobby state is complete
             // with the appropriate variables
             gameData = gameManager.getGameData();
             init();
             getDealer();
             if(checkValue(dealerCards[0]) <= checkValue(dealerCards[1])){
                 gameData.dealer = playerNames[0];
                 gameData.card1 = dealerCards[0].value;
			 }
			 else{
                 gameData.dealer = playerNames[1];
                 gameData.card1 = dealerCards[1].value;
			 }
             gameData.deck_id = deckID;
             gameData.phase = setupState;
			 gameData.pile = pile;
             gameManager.updateGameData(gameData, false);
             console.log("Moving into setup phase.");
             gameData = gameManager.getGameData();
             k = 0;
         }

     }

     // Setup State


	// Setup State

	else if (gamePhase == setupState){
	 	if (event.requestExtraMessageData.getDealerCard == "card"){
            gameManager.sendGameMessageToPlayer(event.playerInfo.playerId, dealerCards[k]);
            k++;
		}

		if (k >= 2) {
            shuffle();
            gameManager.sendGameMessageToAllConnectedPlayers({ toDealScreen: "toDealState" });;
            gameData.phase = dealState;
            gameManager.updateGameData(gameData, false);
            console.log("Moving into Deal State");
            gameData = gameManager.getGameData();
        }
	}
	// Deal State

	else if (gamePhase == dealState){
		if(event.requestExtraMessageData.getDealer == "dealer"){
			gameManager.sendGameMessageToPlayer(event.playerInfo.playerId, {dealer: gameData.dealer,
																			yourName: event.playerInfo.playerData.name});
		}

		if (event.requestExtraMessageData.deal == "deal") {
            document.getElementById("gameStateDisplayHeader").innerHTML = "Dealing..";
            deal();
            for (i = 0; i < p1h.length; i++) {
                p1Hand[i] = p1h[i].value;
            }
            for (i = 0; i < p2h.length; i++) {
                p2Hand[i] = p2h[i].value;
            }
            gameManager.sendGameMessageToPlayer(playerIDs[0], p1Hand);
            gameManager.sendGameMessageToPlayer(playerIDs[1], p2Hand);

            gameData.numCards = numCards;
            gameData.phase = cribState;
            console.log("Moving into Crib State");
            gameManager.updateGameData(gameData, false);
            gameData = gameManager.getGameData();
        }
	}


	// Crib State
	else if(gamePhase == cribState && event.requestExtraMessageData.baby == "crib"){
		document.getElementById("gameStateDisplayHeader").innerHTML = "Counting Crib";
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
		document.getElementById("gameStateDisplayHeader").innerHTML = "Pegging";
		if(event.requestExtraMessageData.datBoi == "p1"){
			if(event.requestExtraMessageData.go == "yes"){
				peg("p2", 1 + p2Score);
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
				peg("p1", 1 + p1score);
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

		document.getElementById("gameStateDisplayHeader").innerHTML = "Game Over";


         // Write a function that displays something for winning

	}

	// Ignore any events not pertaining to a specific state of the game
	else {}
});
	 
//  Event listeners for players that quit or are disconnected by accident (server's fault)
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_QUIT);
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_DROPPED);



