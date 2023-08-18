import { GameClient } from "./GameClient.js";
import { StartingMenu } from "./StartingMenu.js";

let gameClient = new GameClient();
new StartingMenu(
    gameClient.startLobby.bind(gameClient),
    gameClient.joinLobby.bind(gameClient)
);
