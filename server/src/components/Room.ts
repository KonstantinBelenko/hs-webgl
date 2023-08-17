import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { Player } from "./Player";
import { SpawnPlayerResponse } from "./Responses/spawnPlayerResponse";
import { ObjectTypes } from './Responses/objectTypes';
import { RoomCreatedResponse } from './Responses/roomCreatedResponse';
import { MovePlayerResponse } from "./Responses/movePlayerResponse";
import { TagPlayerResponse } from "./Responses/tagPlayerRespnse";
import { StartGameResponse } from "./Responses/startGameResponse";
import { ScoreAndTimeResponse } from "./Responses/scoreAndTimeResponse";
import { EndGameResponse } from "./Responses/endGameResponse";

export class Room {

    public id = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3, separator: '-' })
    public players = new Map<string, Player>()
    public gameStarted = false;
    public timeLeft = 0;

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
                player.name,
                player.isTagged,
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

    public broadcastPlayerTagged (taggedName: string, taggerName: string) {
        if (this.players.size === 1) return;

        this.players.forEach(p => {
            p.send(new TagPlayerResponse(
                taggedName,
                taggerName
            ));
        });
    }

    public broadcastGameStarted () {
        if (this.players.size === 1) return;

        this.players.forEach(p => {
            p.send(new StartGameResponse());
        });
    }

    public tagRandomPlayer () {
        if (this.players.size === 1) return;

        let players = Array.from(this.players.values())
        let randomIndex = Math.floor(Math.random() * players.length)
        let randomPlayer = players[randomIndex]
        randomPlayer.setTagged(true);
        this.broadcastPlayerTagged(randomPlayer.name, 'server');
        console.log('Player tagged: ', randomPlayer.name)
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
    
        const duration = 3 * 60 * 1000; // 3 minutes in milliseconds
        const startTime = Date.now(); // Store the start time
        
        // Start a timer that ticks every second
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime; // Calculate elapsed time using Date
            this.timeLeft = duration - elapsed;
            
            // Add score to every player that isn't tagged
            this.players.forEach(player => {
                if (!player.isTagged) {
                    player.addScore();
                } else {
                    player.deductScore();
                }
                player.send(new ScoreAndTimeResponse(
                    player.getScore(),
                    this.timeLeft
                ));
            });
            
            // If 3 minutes have passed, clear the timer and end the game
            if (elapsed >= duration) {
                clearInterval(timer);
                this.stopGame();
                let scores: { name: string, score: number }[] = Array.from(this.players.values()).map(p => {
                    return {
                        name: p.name,
                        score: p.getScore(),
                    }
                });
                this.players.forEach(p => {
                    p.send(new EndGameResponse(scores));
                });
            }
        }, 1000);
    }
    

    public stopGame () {
        this.gameStarted = false;
        console.log('Game stopped')
    }
}