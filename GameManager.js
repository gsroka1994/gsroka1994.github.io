var gameManager;

window.onload = function() {
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
  this.debugUi = new cast.receiver.games.debug.DebugUI(this.gameManager);
};
