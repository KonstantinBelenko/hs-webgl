import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import Player from "./Player";
import SpawnPlayerResponse from "./Responses/spawnPlayerResponse";
import { ObjectTypes } from './Responses/objectTypes';
import RoomCreatedResponse from './Responses/roomCreatedResponse';
import MovePlayerResponse from "./Responses/movePlayerResponse";

export default class Room {

    public id = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3, separator: '-' })
    public players = new Map<string, Player>()
    public gameStarted = false;

    constructor (owner: Player) {
        this.players.set(owner.name, owner)
        owner.send(new RoomCreatedResponse(this.id))
        console.log('Room created: ', this.id)
    }

    public addPlayer (player: Player) {
        if (this.gameStarted) {
            console.log('Game already started, cannot add player')
        }
        this.players.set(player.name, player)
    }

    public broadcastPlayerSpawn (player: Player) {
        if (this.players.size === 1) return;
        
        // Remove the player that just joined from the list
        let players = Array.from(this.players.values())
        players = players.filter(p => p.name !== player.name)

        // Send spawn player request to everybody else
        players.forEach(p => {
            p.send(new SpawnPlayerResponse(
                player.location,
                player.rotation,
                player.scale,
                ObjectTypes.PLAYER,
                player.name
            ))
        });
    }

    public broadcastMovePlayer (player: Player) {
        if (this.players.size === 1) return;

        // Remove the player that just joined from the list
        let players = Array.from(this.players.values())
        players = players.filter(p => p.name !== player.name)

        // Send spawn player request to everybody else
        players.forEach(p => {
            p.send(new MovePlayerResponse(
                ObjectTypes.PLAYER,
                player.name,
                player.location,
                player.rotation,
            ));
        });
    }

    public getPlayer (name: string): Player {
        let player = this.players.get(name);
        if (player) {
            return player;
        } else {
            throw new Error(`Player not found: ${name}`)
        }
    }

    public removePlayer (player: Player) {
        this.players.delete(player.name)
        console.log('Player removed: ', player.name)
    }

    public startGame () {
        this.gameStarted = true;
        console.log('Game started')
    }

    public stopGame () {
        this.gameStarted = false;
        console.log('Game stopped')
    }
}