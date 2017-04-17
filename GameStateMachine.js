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
var = numberOfPlayers = 0;
var P1Peg1 = 0;
var p1Peg2 = -1;
var p2Peg1 = 0;
var p2Peg2 = -1;
var skunked = 0;

// Opens lobby for sender apps and updates game data to reflect current state
 gameManager.updateLobbyState(cast.receiver.games.LobbyState.OPEN, null);
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
	 if(gamePhase == waitingState){
		
		// Ready the Readied Players
        var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
       
	   // Ensure that nobody is breaking our rules for player size
        if(!(readyPlayers.length < minPlayers || readyPlayers.length > maxPlayers)){
          
		  //If that's the case, the move those players from READY to PLAYING
		  // The lobby is closed, as play is about to begin
          gameManager.updateLobbyState(cast.receiver.games.LobbyState.CLOSED, null, true);
          var readyPlayers = gameManager.getPlayersInState(cast.receiver.games.PlayerState.READY);
          document.getElementById("playerList").innerHTML = event.playerInfo.playerData.name + " is setting up the game";
          
          for (var i = 0; i < readyPlayers.length; i++) {
            var playerInfo = readyPlayers[i];
            var playerId = playerInfo.playerId;
            gameManager.updatePlayerState(playerId, cast.receiver.games.PlayerState.PLAYING, null, true);
          }
		  
		  // Update the gameData now that we have our players and the lobby state is complete 
		  // with the appropriate variables
          var gameData = gameManager.getGameData();
          gameData.phase = setupPhase;
		  gameData.p1Peg1 = p1Peg1;
		  gameData.p1Peg2 = p1Peg2;
		  gameData.p2Peg1 = p2Peg1;
		  gameData.p2Peg2 = p2Peg2;
          gameManager.updateGameData(gameData, false);
          console.log("Moving into setup phase.");
          gameData = gameManager.getGameData();
        } 
		
		
		// Setup State
		else if (gamePhase == setupState){
			
			
		}
		
		// Deal State
		else if (gamePhase == dealState){
			
		
		}
		
		
		// Crib State 
		else if(gamePhase == cribState){
			
			
		}
		
		// Pegging State
		else if (gamePhase == peggingState){
			
		}
		
		// Update Board State
		else if(gamePhase == updateBoardState){
			
		}
		
		// Game Over State
		else if (gamePhase == gameOver){
			
		}
		
		// Ignore any events not pertaining to a specific state of the game
		else {}
	 }
	 
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_QUIT, displayQuitPlayers);
gameManager.addEventListener(cast.receiver.games.EventType.PLAYER_DROPPED, displayQuitPlayers);
	 
	 
	 
	 
	 
}