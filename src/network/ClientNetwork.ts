// ClientNetwork.ts - Stub for single-player mode
import { Vector3 } from 'three';

export interface PlayerState {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  health: number;
  weapon: string;
}

export interface GameMessage {
  type: 'move' | 'shoot' | 'damage' | 'death' | 'respawn' | 'chat';
  payload: any;
}

export class ClientNetwork {
  private players: Map<string, PlayerState> = new Map();
  private playerId: string = 'player1';
  private connected: boolean = false;

  public async connect(serverAddress: string): Promise<void> {
    // Stub: always connect for single-player
    this.connected = true;
    this.playerId = 'player1';
    console.log('Connected in single-player mode');
  }

  public sendPlayerMove(position: Vector3, rotation: { x: number; y: number; z: number }): void {
    // Stub: do nothing
  }

  public sendShot(position: Vector3, direction: Vector3): void {
    // Stub: do nothing
  }

  public sendDamage(targetId: string, damage: number): void {
    // Stub: do nothing
  }

  public sendChat(message: string): void {
    // Stub: do nothing
  }

  public disconnect(): void {
    this.connected = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getPlayerId(): string {
    return this.playerId;
  }

  public getPlayers(): Map<string, PlayerState> {
    return this.players;
  }
}
