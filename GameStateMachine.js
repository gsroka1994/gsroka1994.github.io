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
var currentPlayer = "";
var playerIDs = [];
var pile = [];
var countScores = [];
var numCountScores = 0;
var countBreakDown;
var ready = {
		player1: "",
		player2: ""
};
var k;
var playerNames = [];
var p;
var notP;

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
                 gameData.currentPlayer = readyPlayers[1];
                 gameData.card1 = dealerCards[0].value;
			 }
			 else{
                 gameData.dealer = playerNames[1];
                 gameData.currentPlayer = readyPlayers[0];
                 gameData.card2 = dealerCards[1].value;
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
            gameManager.sendGameMessageToPlayer(event.playerInfo.playerId, dealerCards[k].code);
            k++;
		}

		if (k >= 2) {
            shuffle();
            //setTimeout(myFunction, 10000);
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
			gameManager.sendGameMessageToPlayer(playerIDs[0], {dealer: gameData.dealer,
				yourName: playerNames[0]});
            gameManager.sendGameMessageToPlayer(playerIDs[1], {dealer: gameData.dealer,
                yourName: playerNames[1]});
		}

		if (event.requestExtraMessageData.deal == "deal") {
            document.getElementById("gameStateDisplayHeader").innerHTML = "Dealing..";
            deal();
            gameManager.sendGameMessageToAllConnectedPlayers({ toDiscardScreen: "toDiscardState"});
            p1Hand.card1 = p1h[0].code;
			p1Hand.card1 = p1h[0].code;
            p1Hand.card2 = p1h[1].code;
            p1Hand.card3 = p1h[2].code;
            p1Hand.card4 = p1h[3].code;
            p1Hand.card5 = p1h[4].code;
            p1Hand.card6 = p1h[5].code;


            p2Hand.card1 = p1h[0].code;
            p2Hand.card2 = p1h[1].code;
            p2Hand.card3 = p1h[2].code;
            p2Hand.card4 = p1h[3].code;
            p2Hand.card5 = p1h[4].code;
            p2Hand.card6 = p1h[5].code;

            gameManager.sendGameMessageToPlayer(playerIDs[0], p1Hand);
            gameManager.sendGameMessageToPlayer(playerIDs[1], p2Hand);

            gameData.numCards = numCards;
            gameData.phase = cribState;
            cardsInCrib = 0;
            console.log("Moving into Crib State");
            gameManager.updateGameData(gameData, false);
            gameData = gameManager.getGameData();
        }
	}


	// Crib State
	else if(gamePhase == cribState) {
         document.getElementById("gameStateDisplayHeader").innerHTML = "Getting Crib";
         if (event.requestExtraMessageData.cribSet == "Yes") {
             var playerHand = [];
             var receivedCrib = [event.requestExtraMessageData.crib1, event.requestExtraMessageData.crib2];
             if(event.playerInfo.playerId == playerIDs[0]){
             	playerHand = p1Hand;
			 }
			 else{
             	playerHand = p2Hand;
			 }
             for (i = 0; i < 2; i++){
             	for(var j = 0; j < playerHand.length; j++){
             		if(playerHand[j].code == receivedCrib[i]){
             			crib[cardsInCrib] = playerHand[j];
             			cardsInCrib++;
             			break;
					}
				}
			 }
			 for(i = 0; i < playerHand.length; i++){
             	if(playerHand[i] == crib[cardsInCrib - 1]){
             		playerHand.splice(i,1);
             		break;
				}
			 }
             for(i = 0; i < playerHand.length; i++){
                 if(playerHand[i] == crib[cardsInCrib]){
                     playerHand.splice(i,1);
                     break;
                 }
             }
             if(event.playerInfo.playerId == playerIDs[0]){
                 p1Hand = playerHand;
             }
             else{
                 p2Hand = playerHand;
             }

             if(cardsInCrib >= 3) {
                 gameData.phase = peggingState;
                 gameManager.sendGameMessageToAllConnectedPlayers({ toPeggingScreen: "toPeggingScreen"});
                 console.log("Moving into Pegging State");
                 score = 0;
                 gameManager.updateGameData(gameData, false);
                 gameData = gameManager.getGameData();
             }
         }
     }

	// Pegging State
	else if (gamePhase == peggingState){
		document.getElementById("gameStateDisplayHeader").innerHTML = "Pegging";
		if(event.requestExtraMessageData.getTurn == "turn"){
            gameManager.sendGameMessageToPlayer({turn: currentPlayer.playerData.name,
                player: playerName[0]});
            gameManager.sendGameMessageToPlayer({turn: currentPlayer.playerData.name,
                player: playerName[1]});
		}


		if(event.requestExtraMessageData.pegging == "Yes"){
			if(currentPlayer == readyPlayers[0]){
				p = "p1";
				notP = "p2";

			}
			else {
				p = "p2";
				notP = "p1";
			}
			if(event.requestExtraMessageData.go == "yes"){
				peg(notP, 1 + p2Score);
			}
			else {
				pile[pile.size] = event.requestExtraMessageData.pegCard;
                score = scorePegging(pile);
                p1Score += score;
                peg(p, p1Score + score);
                gameData.p1Score = p1Score + score;
            }
            if(currentPlayer.playerId = playerIDs[0]){
                currentPlayer = readyPlayers[1];
            }
            else {
                currentPlayer = readyPlayers[0];
            }
            if (pile.size >= 8){
                gameData.phase = updateBoardState;
                console.log("Moving into Update Board State");
                gameManager.sendGameMessageToAllConnectedPlayers({ toCountScreen: cutCard.code});
            }
            else {
                gameManager.sendGameMessageToPlayer({
                    turn: currentPlayer.playerData.name,
                    player: playerName[0]
                });
                gameManager.sendGameMessageToPlayer({
                    turn: currentPlayer.playerData.name,
                    player: playerName[1]
                });
            }
		}
	 	 gameManager.updateGameData(gameData, false);
	  	 gameData = gameManager.getGameData();
	  	 numCountScores = 0;
	}

	// Update Board State
	else if(gamePhase == updateBoardState){
		// Stuff for scoring hands (received from sender)
		 if(event.requestExtraMessageData.count == "Yes"){
				countScores[numCountScores] = event.requestExtraMessageData.handCount;
				countBreakDown[numCountScores] = event.requestExtraMessageData.handCountString;
				numCountScores++;
		 }

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
			gameData.phase = dealState;
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



