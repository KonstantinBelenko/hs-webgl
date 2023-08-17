import express from "express";
import expressWs from "express-ws";
import { Room } from "./components/Room";
import { WebSocket } from "ws";
import { RequestParser } from "./components/Requests/RequestParser";
import { Player } from "./components/Player";
import { RoomJoinedResponse } from "./components/Responses/roomJoinedResponse";
import { RequestType } from "./components/Requests/requestTypes";
import { ObjectTypes } from "./components/Responses/objectTypes";
import { SpawnPlayerResponse } from "./components/Responses/spawnPlayerResponse";

export default class Server {
    private port: number;
    public app = express();
    public expressWs: expressWs.Instance;
    public rooms = new Map<string, Room>();

    constructor(port: number) {
        this.port = port;

        this.expressWs = expressWs(this.app);
        this.expressWs.app.ws('/connect', this.handleConnect.bind(this));
    }

    private handleConnect(ws: WebSocket, req: express.Request) {
        console.log("Client connected");
        ws.on('message', this.handleMessage.bind(this, ws));
        ws.on ('close', this.handleDisconnect.bind(this));
        ws.on('error', this.handleErrors.bind(this));
    }

    private handleMessage(ws: WebSocket, message: string) {
        const parser = new RequestParser(message);
        const type = parser.baseRequest().type;

        if (type !== RequestType.MOVE_PLAYER) {
            console.log(type);
        }

        if (type === RequestType.CREATE_ROOM) {
            let req = parser.createLobbyRequest();
            let player = new Player(ws, req.name, true);
            let room = new Room(player);
            this.rooms.set(room.id, room);
        }
        
        if (type === RequestType.JOIN_ROOM) {
            let req = parser.joinLobbyRequest();
            let player = new Player(ws, req.name, false);
            let room = this.rooms.get(req.roomId);
            if (room) {
                // 1. Add player to room
                room.addPlayer(player);
                player.send(new RoomJoinedResponse(room.id));
                
                // 2. Send spawn player request to the new player of everybody else
                let players = Array.from(room.players.values());
                players = players.filter(p => p.name !== player.name);
                players.forEach(p => {
                    player.send(new SpawnPlayerResponse(
                        p.location,
                        p.rotation,
                        p.scale,
                        ObjectTypes.PLAYER,
                        p.name,
                        p.isTagged,
                    ));
                });
            } else {
                console.log('Room not found')
            }
        }

        if (type === RequestType.SPAWN_PLAYER) {
            // the client wants everybody else 
            // in the room to spawn his body
            let req = parser.SpawnPlayerRequest();
            let room = this.rooms.get(req.roomId);
            if (room) {
                let playerName = req.name;
                let player = room.getPlayer(playerName);
                player?.setLocation(req.location);
                player?.setRotation(req.rotation);
                player?.setScale(req.scale);
                room.broadcastPlayerSpawn(player);
            }
        }

        if (type === RequestType.MOVE_PLAYER) {
            let req = parser.MovePlayerRequest();
            let room = this.rooms.get(req.roomId);
            if (room) {
                let playerName = req.name;
                let player = room.getPlayer(playerName);
                player?.setLocation(req.location);
                player?.setRotation(req.rotation);
                room.broadcastMovePlayer(player);
            }
        }

        if (type === RequestType.TAG_PLAYER) {
            console.log('tag player request received');
            let req = parser.TagPlayerRequest();
            let room = this.rooms.get(req.roomId);
            if (room) {
                let tagger = room.getPlayer(req.taggerPlayerName);
                tagger.setTagged(false);
                
                let tagged = room.getPlayer(req.taggedPlayerName);
                tagged.setTagged(true);

                room.broadcastPlayerTagged(req.taggedPlayerName, req.taggerPlayerName);
            }
        }

        if (type === RequestType.START_GAME) {
            console.log('start game request received');
            let req = parser.StartGameRequest();
            let room = this.rooms.get(req.roomId);
            if (room) {
                room.broadcastGameStarted();
                room.tagRandomPlayer();
                room.startGame();
            }
        }
    }   

    private handleDisconnect(ws: WebSocket) {
        console.log("Client disconnected");
    }

    private handleErrors(err: Error) {
        console.log(`Error: ${err.message}`);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}