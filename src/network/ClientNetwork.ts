// ClientNetwork.ts - WebSocket client for multiplayer
import { io, Socket } from 'socket.io-client';
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
  private socket: Socket | null = null;
  private players: Map<string, PlayerState> = new Map();
  private playerId: string = '';
  private connected: boolean = false;

  public async connect(serverAddress: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Format server address
        let url = serverAddress;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'http://' + url;
        }

        this.socket = io(url, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
          this.connected = true;
          this.playerId = this.socket!.id;
          console.log('Connected to server:', this.playerId);
          resolve();
        });

        this.socket.on('disconnect', () => {
          this.connected = false;
          console.log('Disconnected from server');
        });

        this.socket.on('player-joined', (data: PlayerState) => {
          console.log('Player joined:', data.id);
          this.players.set(data.id, data);
        });

        this.socket.on('player-left', (playerId: string) => {
          console.log('Player left:', playerId);
          this.players.delete(playerId);
        });

        this.socket.on('player-moved', (data: PlayerState) => {
          this.players.set(data.id, data);
        });

        this.socket.on('error', (error: any) => {
          console.error('Socket error:', error);
          reject(error);
        });

        // Set connection timeout
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  public sendPlayerMove(position: Vector3, rotation: { x: number; y: number; z: number }): void {
    if (this.socket && this.connected) {
      this.socket.emit('player-move', {
        position: { x: position.x, y: position.y, z: position.z },
        rotation
      });
    }
  }

  public sendShot(position: Vector3, direction: Vector3): void {
    if (this.socket && this.connected) {
      this.socket.emit('player-shot', {
        position: { x: position.x, y: position.y, z: position.z },
        direction: { x: direction.x, y: direction.y, z: direction.z }
      });
    }
  }

  public sendDamage(targetId: string, damage: number): void {
    if (this.socket && this.connected) {
      this.socket.emit('damage', { targetId, damage });
    }
  }

  public sendChat(message: string): void {
    if (this.socket && this.connected) {
      this.socket.emit('chat', { message });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getPlayers(): Map<string, PlayerState> {
    return this.players;
  }

  public getPlayerId(): string {
    return this.playerId;
  }
}
