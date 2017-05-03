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
var dealer;
var go1;
var go2;
var score;
var notScore;
var crib = [];
var cardsInCrib = 0;
var currentPlayer = "";
var playerIDs = [];
var pile = [];
var numCountScores = 0;
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
var cardsPegged;
var player1Count;
var player2Count;
var player1Break;
var player2Break;
var cribCount;
var cribBreak;
var cribCounted;
var goToCrib;
var handAfterCrib = [];
var numNewHand;
var newH1 = [];
var newH2 = [];
var sameCard = 0;


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
                document.getElementById("player1Info").innerHTML = readyPlayers[i].playerData.name;
            }
            if (i == 1){
                ready.player2 = readyPlayers[i].playerData.name;
                document.getElementById("player2Info").innerHTML = readyPlayers[i].playerData.name;
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
             if(checkValue(dealerCards[0]) < checkValue(dealerCards[1])){
                 gameData.dealer = playerNames[0];
                 dealer = readyPlayers[0];
                 currentPlayer = readyPlayers[1];
                 gameData.card1 = dealerCards[0].value;
             }
             else if (checkValue(dealerCards[0]) > checkValue(dealerCards[1])) {
                 dealer = readyPlayers[1];
                 gameData.dealer = playerNames[1];
                 currentPlayer = readyPlayers[0];
                 gameData.card2 = dealerCards[1].value;
             }
             else{
                 sameCard = 1;
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
            if(event.playerInfo.playerId == playerIDs[0]){
                document.getElementById("gameInfo").append("\r\n"+playerNames[0]+ " drew a " + dealerCards[0].value);
                var pegCardPlayed = document.getElementById(peggingCardSlotIds[0]);
                pegCardPlayed.src = CARD_IMAGE_URL + dealerCards[0].code + ".png";
                pegCardPlayed.style.opacity = "1";
                pegCardPlayed.style.visibility = "visible";
            }
            else {
                document.getElementById("gameInfo").append("\r\n"+playerNames[1]+ " drew a " + dealerCards[1].value);
                var pegCardPlayed = document.getElementById(peggingCardSlotIds[7]);
                pegCardPlayed.src = CARD_IMAGE_URL + dealerCards[1].code + ".png";
                pegCardPlayed.style.opacity = "1";
                pegCardPlayed.style.visibility = "visible";
            }
	 	    if(bothReady >= 2){
                document.getElementById("gameInfo").append("\r\n\r\n"+gameData.dealer + " won the deal");
                shuffle();
                setTimeout(function(){

                    if(sameCard == 1){
                        gameManager.sendGameMessageToAllConnectedPlayers({sameHand: "sameHand"});
                        k = 0;
                        sameCard = 0;
                        getDealer();
                        if(checkValue(dealerCards[0]) < checkValue(dealerCards[1])){
                            gameData.dealer = playerNames[0];
                            dealer = readyPlayers[0];
                            currentPlayer = readyPlayers[1];
                            gameData.card1 = dealerCards[0].value;
                        }
                        else if (checkValue(dealerCards[0]) > checkValue(dealerCards[1])) {
                            dealer = readyPlayers[1];
                            gameData.dealer = playerNames[1];
                            currentPlayer = readyPlayers[0];
                            gameData.card2 = dealerCards[1].value;
                        }
                        else{
                            sameCard = 1;
                        }
                    }
                    else {
                        gameManager.sendGameMessageToAllConnectedPlayers({toDealScreen: "toDealState"});
                        gameData.phase = dealState;
                        p1Score = 110;
                        p2Score = 110;
                        peg('p1', p1Score);
                        peg('p2', p2Score);
                        gameManager.updateGameData(gameData, false);
                        console.log("Moving into Deal State");
                        gameData = gameManager.getGameData();
                    }
                }, 5000);
            }
        }
	}
	// Deal State

	else if (gamePhase == dealState){
         //clearCountingHand();
         //clearGameInfo(); // Clear the game info

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
            clearPeggingCards();
            clearGameInfo();
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
         clearCountingHand();
         document.getElementById("gameStateDisplayHeader").innerHTML = "Discard Two Cards To The Crib";
         clearGameInfo();

        // Search for the cribs cards in the players hands, then add them to the crib
         if (event.requestExtraMessageData.cribSet == "Yes") {
             var playerHand = [];
             var player = 0;
             var id = event.playerInfo.playerId;
             var receivedCrib = [event.requestExtraMessageData.crib1, event.requestExtraMessageData.crib2];
             if(id == playerIDs[0]){
                 playerHand = p1h;
                 player = 1
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
            numNewHand = 0;
             handAfterCrib = [];
			 // Remove the crib cards from the players hands
			 for(i = 0; i < playerHand.length; i++){
             	if(playerHand[i].code != crib[cardsInCrib - 2].code && playerHand[i].code != crib[cardsInCrib -1].code){
             		handAfterCrib[numNewHand] = playerHand[i];
             		numNewHand++;
				}
			 }

             // Reassemble the hand
             if(player == 1){
                 newH1 = handAfterCrib;

             }
             else{
                 newH2 = handAfterCrib;

             }

             // Once the crib has been collected, move onto the pegging state.  Also get the Cut card, and reset the
             // score variables used during pegging
             if(cardsInCrib >= 3) {
                 gameData.phase = peggingState;
                 gameManager.sendGameMessageToAllConnectedPlayers({ toPeggingScreen: "toPeggingScreen"});
                 console.log("Moving into Pegging State");
                 getTurnUpCard(); // Get and show turnup Card
                 if(cutCard.value == "JACK"){
                     document.getElementById("gameInfo").innerHTML = dealer.playerData.name + " knobs for 2";
                     if(dealer == readyPlayers[0]){
                         p1Score++;
                         document.getElementById("player1Score").innerHTML = p1Score;
                         peg('p1', p1Score);
                         checkWinner(p1Score, readyPlayers[0].playerData.name);
                     }
                     else{
                         p2Score++;
                         document.getElementById("player2Score").innerHTML = p2Score;
                         peg('p2', p2Score);
                         checkWinner(p2Score, readyPlayers[1].playerData.name);
                     }
                 }
                 score = 0;
                 notScore = 0;
                 pileCount = 0;
                 go1 = 0;
                 go2 = 0;
                 cardsPegged = 0;
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

                document.getElementById("gameInfo").innerHTML = currentPlayer.playerData.name + " said go";

			    if(currentPlayer == readyPlayers[0]){
			        go1++;
                }
                else {
			        go2++;
                }
                if(go1 == 2){
                    go1 = 1;
                }
                if(go2 == 2){
                    go2 = 1;
                }
                if((go1 + go2) == 2) {
                    if (currentPlayer == readyPlayers[0]) {
                        p1Score++;
                        document.getElementById("player1Score").innerHTML = p1Score;
                        peg("p1", p1Score);
                        checkWinner(p1Score, currentPlayer.playerData.name);
                    }
                    else {
                        p2Score++;
                        document.getElementById("player2Score").innerHTML = p2Score;
                        peg("p2", p2Score);
                        checkWinner(p2Score, currentPlayer.playerData.name);
                    }
                    document.getElementById("gameInfo").innerHTML = currentPlayer.playerData.name + " pegged for 1 on a go";
                    pileCount = 0;
                    document.getElementById("countInfo").innerHTML = "Current Sum: " + pileCount;
                    go1 = 0;
                    go2 = 0;
                    pile = [];
                    pileCount = 0;
                    dimPeggingCards();

                }

			}

			// Score the card sent as normal and adjust the players scores
			else {
				pile[pile.length] = parseInt(event.requestExtraMessageData.pegCard);
                if(pile[pile.length-1] > 10){
                    pileCount+=10;
                }
                else {
                    pileCount += pile[pile.length - 1];
                }
                playPeggingCard(event.requestExtraMessageData.pegCode);
                cardsPegged++;
                score = scorePegging(pile, currentPlayer.playerData.name, pileCount);
                if(score > 0 && currentPlayer == readyPlayers[0]) {
                    peg(p, score + p1Score);
                    p1Score += score;
                    document.getElementById("player1Score").innerHTML = p1Score;
                    checkWinner(p1Score, playerNames[0]);
                }
                else if(score > 0 && currentPlayer == readyPlayers[1]){
                    peg(p, score + p2Score);
                    p2Score += score;
                    document.getElementById("player2Score").innerHTML = p2Score;
                    checkWinner(p2Score, playerNames[1]);
                }
                else {}
                if(pileCount == 31){
                        pileCount = 0;
                        pile = [];
                        go1 = 0;
                        go2 = 0;
                        dimPeggingCards();

                }
            }



            // Once pegging is complete, move onto the update board state
            if (cardsPegged == 8){
                if (currentPlayer == readyPlayers[0]) {
                    p1Score++;
                    document.getElementById("player1Score").innerHTML = p1Score;
                    peg("p1", p1Score);
                    checkWinner(p1Score, playerNames[0]);
                }
                else {
                    p2Score++;
                    document.getElementById("player2Score").innerHTML = p2Score;
                    peg("p2", p2Score);
                    checkWinner(p2Score, playerNames[1]);
                }
                document.getElementById("gameInfo").append(currentPlayer.playerData.name + " had last card for 1");
                setTimeout(function(){
                    gameData.phase = updateBoardState;
                    console.log("Moving into Update Board State");
                    gameManager.sendGameMessageToAllConnectedPlayers({toCountScreen: cutCard.code});
                    numCountScores = 0;
                    player1Count = 0;
                    player2Count = 0;
                    cribCount = 0;
                    cribCounted = 0;
                    goToCrib = 0;
                    pile = [];
                }, 5000);


            }

            // Otherwise alert the players of the new turn
            else {

                // Swap current player
                if(currentPlayer.playerId == playerIDs[0]){
                    currentPlayer = readyPlayers[1];
                }
                else {
                    currentPlayer = readyPlayers[0];
                }

                console.log(pileCount);
                document.getElementById("countInfo").innerHTML = "Current Sum: " + pileCount;
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
         clearPeggingCards();
         // Stuff for scoring hands (received from sender)
		 if(event.requestExtraMessageData.count == "Yes") {
             if (event.playerInfo.playerId == playerIDs[0]) {
                 player1Count = parseInt(event.requestExtraMessageData.handCount);
                 player1Break = event.requestExtraMessageData.handCountString;
                 //player1Break = player1Break.value.split(/\r\n|\r|\n/g);

             }
             else {
                 player2Count = parseInt(event.requestExtraMessageData.handCount);
                 player2Break = event.requestExtraMessageData.handCountString;
                 //player2Break = player2Break.value.split(/\r\n|\r|\n/g);

             }
             numCountScores++;

             // Count Non Dealer Cards First
             if (numCountScores == 2) {
                 if (dealer == readyPlayers[0]) {
                     clearCountingHand();
                     gameManager.sendGameMessageToPlayer(playerIDs[1], {yourTurn : "Yes"});
                     if(player2Count != 0) {
                         peg('p2', p2Score + player2Count);
                         p2Score += player2Count;
                         document.getElementById("player2Score").innerHTML = p2Score;
                         checkWinner(p2Score, playerNames[1]);

                     }


                     document.getElementById("gameStateDisplayHeader").innerHTML = "Counting " + playerNames[1] + "'s Hand";
                     document.getElementById("gameInfo").innerHTML = player2Break;
                     document.getElementById("countInfo").innerHTML = "Hand Total: " + player2Count;

                     document.getElementById("countingHandCard0").src = newH2[0].image;
                     document.getElementById("countingHandCard1").src = newH2[1].image;
                     document.getElementById("countingHandCard2").src = newH2[2].image;
                     document.getElementById("countingHandCard3").src = newH2[3].image;

                     displayCountingHand();

                 }
                 else {
                     clearCountingHand();
                     gameManager.sendGameMessageToPlayer(playerIDs[0], {yourTurn : "Yes"});
                    if(player1Count != 0) {
                        peg('p1', p1Score + player1Count);
                        p1Score += player1Count;
                        document.getElementById("player1Score").innerHTML = p1Score;
                        checkWinner(p1Score, playerNames[0]);

                    }


                     document.getElementById("gameStateDisplayHeader").innerHTML = "Counting " + playerNames[0] + "'s Hand";
                     document.getElementById("gameInfo").innerHTML = player1Break;
                     document.getElementById("countInfo").innerHTML = "Hand Total: " + player1Count;


                     document.getElementById("countingHandCard0").src = newH1[0].image;
                     document.getElementById("countingHandCard1").src = newH1[1].image;
                     document.getElementById("countingHandCard2").src = newH1[2].image;
                     document.getElementById("countingHandCard3").src = newH1[3].image;

                     displayCountingHand();
                 }
             }

         }

         // Count the Dealers hands
         if(event.requestExtraMessageData.move == "Next" && event.playerInfo != dealer){
             if (dealer == readyPlayers[0]) {
                 clearCountingHand();
                 gameManager.sendGameMessageToPlayer(playerIDs[0], {yourTurn : "Yes"});
                 if(player1Count != 0) {
                     peg('p1', p1Score + player1Count);
                     p1Score += player1Count;
                     document.getElementById("player1Score").innerHTML = p1Score;
                     checkWinner(p1Score, playerNames[0]);

                 }

                 document.getElementById("gameStateDisplayHeader").innerHTML = "Counting " + playerNames[0] + "'s Hand";
                 document.getElementById("gameInfo").innerHTML = player1Break;
                 document.getElementById("countInfo").innerHTML = "Hand Total: " + player1Count;


                 document.getElementById("countingHandCard0").src = newH1[0].image;
                 document.getElementById("countingHandCard1").src = newH1[1].image;
                 document.getElementById("countingHandCard2").src = newH1[2].image;
                 document.getElementById("countingHandCard3").src = newH1[3].image;

                 displayCountingHand();
             }
             else {
                 clearCountingHand();
                 gameManager.sendGameMessageToPlayer(playerIDs[1], {yourTurn : "Yes"});
                 if(player2Count != 0) {
                     peg('p2', p2Score + player2Count);
                     p2Score += player2Count;
                     document.getElementById("player2Score").innerHTML = p2Score;
                     checkWinner(p2Score, playerNames[1]);
                 }

                 document.getElementById("gameStateDisplayHeader").innerHTML = "Counting " + playerNames[1] + "'s Hand";
                 document.getElementById("gameInfo").innerHTML = player2Break;
                 document.getElementById("countInfo").innerHTML = "Hand Total: " + player2Count;


                 document.getElementById("countingHandCard0").src = newH2[0].image;
                 document.getElementById("countingHandCard1").src = newH2[1].image;
                 document.getElementById("countingHandCard2").src = newH2[2].image;
                 document.getElementById("countingHandCard3").src = newH2[3].image;

                 displayCountingHand();
             }
         }

         if(event.requestExtraMessageData.move == "Next" && event.playerInfo == dealer){
             gameManager.sendGameMessageToPlayer(dealer.playerId, {cribCard1: crib[0].code,
                                                                    cribCard2: crib[1].code,
                                                                    cribCard3: crib[2].code,
                                                                    cribCard4: crib[3].code,
                                                                    cribCard5: cutCard.code});
         }


        // Once both hands and the crib have been counted, shuffled the deck and return to the Deal
        if (event.requestExtraMessageData.crib == "Yes") {
           cribCount = parseInt(event.requestExtraMessageData.handCount);
           cribBreak = event.requestExtraMessageData.handCountString;
            //cribBreak = cribBreak.value.split(/\r\n|\r|\n/g);
             if (dealer == readyPlayers[0]) {
                 clearCountingHand();
                 gameManager.sendGameMessageToPlayer(playerIDs[0], {yourTurn : "Crib"});
                 if(cribCount != 0) {
                     peg('p1', p1Score + cribCount);
                     p1Score += cribCount;
                     document.getElementById("player1Score").innerHTML = p1Score;
                     checkWinner(p1Score, playerNames[0]);
                 }

                 document.getElementById("gameStateDisplayHeader").innerHTML = "Counting " + playerNames[0] + "'s Crib";
                 document.getElementById("gameInfo").innerHTML = cribBreak;
                 document.getElementById("countInfo").innerHTML = "Crib Total: " + cribCount;


                 document.getElementById("countingHandCard0").src = crib[0].image;
                 document.getElementById("countingHandCard1").src = crib[1].image;
                 document.getElementById("countingHandCard2").src = crib[2].image;
                 document.getElementById("countingHandCard3").src = crib[3].image;

                 displayCountingHand();

            }
            else {
                 clearCountingHand();
                 gameManager.sendGameMessageToPlayer(playerIDs[1], {yourTurn : "Crib"});
                 if(cribCount != 0) {
                     peg('p2', p2Score + cribCount);
                     p2Score += cribCount;
                     document.getElementById("player2Score").innerHTML = p2Score;
                     checkWinner(p2Score, playerNames[1]);
                 }
                 
                 document.getElementById("gameStateDisplayHeader").innerHTML = "Counting " + playerNames[1] + "'s Crib";
                 document.getElementById("gameInfo").innerHTML = cribBreak;
                 document.getElementById("countInfo").innerHTML = "Crib Total: " + cribCount;


                 document.getElementById("countingHandCard0").src = crib[0].image;
                 document.getElementById("countingHandCard1").src = crib[1].image;
                 document.getElementById("countingHandCard2").src = crib[2].image;
                 document.getElementById("countingHandCard3").src = crib[3].image;
            }
            cribCounted = 1;

        }

        if(cribCounted == 1 && event.requestExtraMessageData.move == "Next") {
            // Switch the dealer for the next round

            if (dealer == readyPlayers[0]) {
                dealer = readyPlayers[1];
                gameData.dealer = readyPlayers[1].playerData.name;
                currentPlayer = readyPlayers[0];
            }
            else {
                dealer = readyPlayers[0];
                gameData.dealer = readyPlayers[0].playerData.name;
                currentPlayer = readyPlayers[1];
            }
            // Reshuffle the deck
            shuffle();
            gameData.phase = dealState;
            gameManager.sendGameMessageToAllConnectedPlayers({ toDealScreen: "toDealState" });
            console.log("Moving to Deal State");
            gameManager.updateGameData(gameData, false);
            gameData = gameManager.getGameData();
        }

	}

	// Game Over State
	else if (gamePhase == gameOver){

	    if(event.requestExtraMessageData.displayChange == "displayChange") {
            document.getElementById("gameStateDisplayHeader").innerHTML = "Game Over\r\n" + winner + " Won!";
        }
         // Write a function that displays something for winning
        if (event.requestExtraMessageData.newGame == "newGame"){
            gameData.phase = setupState;
            p1Score = 0;
            peg('p1', p1Score);
            p2Score = 0;
            peg('p2', p2Score);
            document.getElementById("player1Score").innerHTML = "0";
            document.getElementById("player2Score").innerHTML = "0";
            k = 0;
            bothReady = 0;
            getDealer();
            if(checkValue(dealerCards[0]) < checkValue(dealerCards[1])){
                gameData.dealer = playerNames[0];
                dealer = readyPlayers[0];
                currentPlayer = readyPlayers[1];
                gameData.card1 = dealerCards[0].value;
            }
            else if (checkValue(dealerCards[0]) > checkValue(dealerCards[1])) {
                dealer = readyPlayers[1];
                gameData.dealer = playerNames[1];
                currentPlayer = readyPlayers[0];
                gameData.card2 = dealerCards[1].value;
            }
            else{
                sameCard = 1;
            }
            console.log("Moving to Setup State");
            gameManager.updateGameData(gameData, false);
            gameData = gameManager.getGameData();
            clearCountingHand();
            document.getElementById("gameStateDisplayHeader").innerHTML = "Select a Card";
            document.getElementById("gameInfo").innerHTML = "";
            document.getElementById("countInfo").innerHTML = "";
            gameManager.sendGameMessageToAllConnectedPlayers({ startAgain: "startAgain" });
        }
	}

	// Ignore any events not pertaining to a specific state of the game
	else {}
});
	 
//  Event listeners for players that quit or are disconnected by accident (server's fault)
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_QUIT);
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_DROPPED);



