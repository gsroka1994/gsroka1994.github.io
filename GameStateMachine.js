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