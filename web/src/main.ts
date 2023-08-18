import { GameClient } from "./GameClient.js";
import { StartingMenu } from "./StartingMenu.js";
import { SettingsMenu } from "./UI/SettingsMenu.js";
import { DefaultUserSettings } from "./Utils/UserSettings.js";

let gameClient = new GameClient();
// Create the starting menu and bind it to the game client.
new StartingMenu(
    gameClient.startLobby.bind(gameClient),
    gameClient.joinLobby.bind(gameClient)
);
