var gameManager;


  var castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  var appConfig = new cast.receiver.CastReceiverManager.Config();
  appConfig.statusText = 'My Game is getting ready';
   console.log("ChromeCast Cribbage is initiating");
  appConfig.maxInactivity = 6000;  // 100 minutes for testing only.

  var gameConfig = new cast.receiver.games.GameManagerConfig();
  gameConfig.applicationName = 'My Game';
  gameConfig.maxPlayers = 2;
  gameManager = new cast.receiver.games.GameManager(gameConfig);

  castReceiverManager.start(appConfig);
  gameManager.updateLobbyState(cast.receiver.games.LobbyState.OPEN);
  gameManager.updateGameData({'phase': 0}, false);

cast.games.gamedebugger.GameDebuggerGame =
    function(GameManager) {
        /** @private {!cast.receiver.games.GameManager} */
        this.gameManager_ = GameManager;

        /**
         * You can access this in the dev console if you want to play around with
         * the debug UI although in this sample, we automatically open the debug UI.
         * @public {!cast.receiver.games.debug.DebugUI}
         */
        this.debugUi = new cast.receiver.games.debug.DebugUI(GameManager);
    };

