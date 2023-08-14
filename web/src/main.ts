import { GameClient } from "./GameClient.js";
import { Lobby } from "./Scenes/Lobby.js";
import { StartingMenu } from "./StartingMenu.js";

// let sm = new StartingMenu(
//     () => {},
//     () => {}
// );
// sm.hideStartForm();


// new Lobby(
//     "abc",
//     "2",
//     () => {},
//     () => {},
//     () => {}
// )


let gameClient = new GameClient();
// Create the starting menu and bind it to the game client.
new StartingMenu(
    gameClient.startLobby.bind(gameClient),
    gameClient.joinLobby.bind(gameClient)
);
