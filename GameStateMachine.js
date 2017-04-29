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
    		card6: ""

};
var p2Hand = {
    card1: "",
    card2: "",
    card3: "",
    card4: "",
    card5: "",
    card6: ""

};
var code = {code: ""};
var gameData;
var p1Score = 0;
var p2Score = 0;
var dealer = 0;
var score;
var notScore;
var skunked = 0;
var winner = -1;  
var crib = [];
var cardsInCrib = 0;
var currentPlayer = "";
var playerIDs = [];
var pile = [];
var countScores = [];
var numCountScores = 0;
var countBreakDown = [];
var ready = {
		player1: "",
		player2: ""
};
var k;
var playerNames = [];
var p;
var notP;
var bothReady = 0;
var readyPlayers = [];
var pileCount;

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
    readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
    for (var i = 0; i < readyPlayers.length; i++){
    	if ( i == 0){
    		ready.player1 = readyPlayers[i].playerData.name;
		}
		if (i == 1){
            ready.player2 = readyPlayers[i].playerData.name;
		}
	}
	gameManager.sendGameMessageToAllConnectedPlayers(ready);

  });
  

  // Main Listener that updates the states.  AKA:  The State Machine
gameManager.addEventListener(cast.receiver.games.EventType.GAME_MESSAGE_RECEIVED, function(event){
     var gamePhase = gameManager.getGameData().phase;

     // Added this for waiting screen to more reliably get players
    if (gamePhase == waitingState && event.requestExtraMessageData.getPlayers == "yes"){
        readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
        for (i = 0; i < readyPlayers.length; i++){
            if ( i == 0){
                ready.player1 = readyPlayers[i].playerData.name;
            }
            if (i == 1){
                ready.player2 = readyPlayers[i].playerData.name;
            }
        }
        gameManager.sendGameMessageToAllConnectedPlayers(ready);
    }
	 
	 // Lobby State 
	 if(gamePhase == waitingState && event.requestExtraMessageData.startGame == "start") {

         document.getElementById("gameStateDisplayHeader").innerHTML = "Game is Starting..";

         // Ready the Readied Players
         readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);

         // Ensure that nobody is breaking our rules for player size
         if (!(readyPlayers.length < minPlayers || readyPlayers.length > maxPlayers)) {

             //If that's the case, the move those players from READY to PLAYING
             // The lobby is closed, as play is about to begin
             gameManager.updateLobbyState(cast.receiver.games.LobbyState.CLOSED, null, true);
             readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
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
                 currentPlayer = readyPlayers[1];
                 gameData.card1 = dealerCards[0].value;
			 }
			 else{
                 gameData.dealer = playerNames[1];
                 currentPlayer = readyPlayers[0];
                 gameData.card2 = dealerCards[1].value;
			 }

             gameData.deck_id = deckID;
             gameData.phase = setupState;
             gameManager.updateGameData(gameData, false);
             console.log("Moving into setup phase.");
             gameData = gameManager.getGameData();
             k = 0;
         }

     }

     // Setup State


	// Setup State

	else if (gamePhase == setupState){

        // Sends a random card from the deck API to the players to decide who the dealer is when they ask
        if (event.requestExtraMessageData.getDealerCard == "card"){
            if(event.playerInfo.playerId == playerIDs[0]){
                code.code = dealerCards[0].code;
            }
            else {
                code.code = dealerCards[1].code;
            }

            gameManager.sendGameMessageToPlayer(event.playerInfo.playerId, code);
            k++;
		}

		// Once setup is complete and both players have chosen a card, suffle the deck then move to the dealing phase
		if (k >= 2 && event.requestExtraMessageData.toDealScreen == "toDealScreen") {
	 	    bothReady++;
	 	    if(bothReady >= 2){
                shuffle();
                setTimeout(function(){
                    gameManager.sendGameMessageToAllConnectedPlayers({ toDealScreen: "toDealState" });
                    gameData.phase = dealState;
                    gameManager.updateGameData(gameData, false);
                    console.log("Moving into Deal State");
                    gameData = gameManager.getGameData();
                }, 10000);
            }
        }
	}
	// Deal State

	else if (gamePhase == dealState){

	    // Alert the players who the dealer is
	    if(event.requestExtraMessageData.getDealer == "dealer"){
            if(event.playerInfo.playerId == playerIDs[0]){
                gameManager.sendGameMessageToPlayer(playerIDs[0], {dealer: gameData.dealer,
                    yourName: playerNames[0]});
            } else {
                gameManager.sendGameMessageToPlayer(playerIDs[1], {dealer: gameData.dealer,
                    yourName: playerNames[1]});
            }
		}

		if (event.requestExtraMessageData.deal == "deal") {
            document.getElementById("gameStateDisplayHeader").innerHTML = "Dealing..";

           // API call for each player to draw 6 cards
            deal();
            gameManager.sendGameMessageToAllConnectedPlayers({toDiscardScreen: "toDiscardState"});

            p1Hand.card1 = p1h[0].code;
            p1Hand.card2 = p1h[1].code;
            p1Hand.card3 = p1h[2].code;
            p1Hand.card4 = p1h[3].code;
            p1Hand.card5 = p1h[4].code;
            p1Hand.card6 = p1h[5].code;

            p2Hand.card1 = p2h[0].code;
            p2Hand.card2 = p2h[1].code;
            p2Hand.card3 = p2h[2].code;
            p2Hand.card4 = p2h[3].code;
            p2Hand.card5 = p2h[4].code;
            p2Hand.card6 = p2h[5].code;

        }

        // Logic for sending the players hands upon request
         if(event.requestExtraMessageData.getHand == "getHand"){

             gameManager.sendGameMessageToPlayer(playerIDs[0], p1Hand);
             gameManager.sendGameMessageToPlayer(playerIDs[1], {sendP2Hand: "getHand" })

         }
         if(event.requestExtraMessageData.getP2Hand == "getHand"){

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
         hideTurnUpCard();
         document.getElementById("gameStateDisplayHeader").innerHTML = "Discard Two Cards To The Crib";


        // Search for the cribs cards in the players hands, then add them to the crib
         if (event.requestExtraMessageData.cribSet == "Yes") {
             var playerHand = [];
             var receivedCrib = [event.requestExtraMessageData.crib1, event.requestExtraMessageData.crib2];
             if(event.playerInfo.playerId == playerIDs[0]){
             	playerHand = p1h;
			 }
			 else{
             	playerHand = p2h;
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

			 // Remove the crib cards from the players hands
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

             // Reassemble the hand
             if(event.playerInfo.playerId == playerIDs[0]){
                 p1h = playerHand;
             }
             else{
                 p2h = playerHand;
             }

             // Once the crib has been collected, move onto the pegging state.  Also get the Cut card, and reset the
             // score variables used during pegging
             if(cardsInCrib >= 3) {
                 gameData.phase = peggingState;
                 gameManager.sendGameMessageToAllConnectedPlayers({ toPeggingScreen: "toPeggingScreen"});
                 console.log("Moving into Pegging State");
                 getTurnUpCard(); // Get and show turnup Card
                 score = 0;
                 notScore = 0;
                 pileCount = 0;
                 gameManager.updateGameData(gameData, false);
                 gameData = gameManager.getGameData();
             }
         }
     }

	// Pegging State
	else if (gamePhase == peggingState){
         document.getElementById("gameStateDisplayHeader").innerHTML = "Pegging";

         // Send out message on the curretn turn once pegging begins
         if(event.requestExtraMessageData.getTurn == "turn"){
            if(event.playerInfo.playerId == playerIDs[0]){
                gameManager.sendGameMessageToPlayer(playerIDs[0], {turn: currentPlayer.playerData.name,
                    player: playerNames[0],
                    pileCount: pileCount});
            } else {
                gameManager.sendGameMessageToPlayer(playerIDs[1], {turn: currentPlayer.playerData.name,
                    player: playerNames[1],
                    pileCount: pileCount});
            }
		}

        // Assign the current player's variables
		if(event.requestExtraMessageData.pegging == "Yes"){
			if(currentPlayer == readyPlayers[0]){
				p = "p1";
				notP = "p2";
				notScore = p2Score;
			}
			else {
				p = "p2";
				notP = "p1";
				notScore = p1Score;
			}

			// If the current player cannot play, they "go" and the other player earns a point
			if(event.requestExtraMessageData.go == "yes"){
				peg(notP, 1 + notScore);
				if(currentPlayer == readyPlayers[0]){
				    p1Score++;
                }
                else {
				    p2Score++;
                }
			}

			// Score the card sent as normal and adjust the players scores
			else {
				pile[pile.length] = event.requestExtraMessageData.pegCard;
                playPeggingCard(event.requestExtraMessageData.pegCode);
                score = scorePegging(pile, currentPlayer.playerData.name);
                if(score > 0 && currentPlayer == readyPlayers[0]) {
                    peg(p, score + p1Score);
                    p1Score += score;
                }
                else if(score > 0 && currentPlayer == readyPlayers[1]){
                    peg(p, score + p2Score);
                    p2Score += score;
                }
                else {}
                pileCount += pile[pile.length - 1];
                if(pileCount == 31){
                    pileCount = 0;
                }
            }

            // Swap current player
            if(currentPlayer.playerId == playerIDs[0]){
                currentPlayer = readyPlayers[1];
            }
            else {
                currentPlayer = readyPlayers[0];
            }

            // Once pegging is complete, move onto the update board state
            if (pile.length >= 8){
                gameData.phase = updateBoardState;
                console.log("Moving into Update Board State");
                gameManager.sendGameMessageToAllConnectedPlayers({toCountScreen: cutCard.code});
                numCountScores = 0;
            }

            // Otherwise alert the players of the new turn
            else {
                gameManager.sendGameMessageToPlayer(playerIDs[0], {
                    turn: currentPlayer.playerData.name,
                    player: playerNames[0],
                    pileCount: pileCount
                });
                gameManager.sendGameMessageToPlayer(playerIDs[1], {
                    turn: currentPlayer.playerData.name,
                    player: playerNames[1],
                    pileCount: pileCount
                });
            }
		}
	 	 gameManager.updateGameData(gameData, false);
	  	 gameData = gameManager.getGameData();

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
		if(winner > 0){
			gameData.phase = gameOver;
			console.log("Moving into Game Over")
		}
		else {
			gameData.phase = dealState;
			console.log("Moving back to Deal");
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



