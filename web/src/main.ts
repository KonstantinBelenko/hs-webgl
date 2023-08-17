import { GameClient } from "./GameClient.js";
import { StartingMenu } from "./StartingMenu.js";


let gameClient = new GameClient();
// Create the starting menu and bind it to the game client.
new StartingMenu(
    gameClient.startLobby.bind(gameClient),
    gameClient.joinLobby.bind(gameClient)
);
