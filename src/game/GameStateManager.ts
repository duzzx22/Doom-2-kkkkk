// GameStateManager.ts - Game state and mode management
import { Engine } from './Engine';
import { ClientNetwork } from '../network/ClientNetwork';

export class GameStateManager {
  private engine: Engine;
  private network: ClientNetwork | null = null;
  private gameMode: 'offline' | 'multiplayer' = 'offline';
  private isHosting: boolean = false;
  private gameStats = {
    kills: 0,
    startTime: 0,
    level: 1
  };

  constructor(engine: Engine) {
    this.engine = engine;
    this.network = new ClientNetwork();
  }

  public startSinglePlayer(): void {
    this.gameMode = 'offline';
    this.isHosting = false;
    this.gameStats = {
      kills: 0,
      startTime: Date.now(),
      level: 1
    };
    
    this.engine.startLevel(1);
  }

  public async connectToServer(serverAddress: string): Promise<void> {
    if (!this.network) {
      this.network = new ClientNetwork();
    }

    const connectionStatus = document.getElementById('connectionStatus');
    if (connectionStatus) {
      connectionStatus.textContent = 'CONECTANDO...';
    }

    try {
      await this.network.connect(serverAddress);
      this.gameMode = 'multiplayer';
      this.isHosting = false;

      if (connectionStatus) {
        connectionStatus.textContent = 'CONECTADO!';
      }

      this.engine.startLevel(1);

      setTimeout(() => {
        document.getElementById('multiplayerMenu')!.style.display = 'none';
        document.getElementById('hud')!.style.display = 'block';
      }, 1000);
    } catch (error) {
      if (connectionStatus) {
        connectionStatus.textContent = 'ERRO NA CONEXÃO';
      }
      console.error('Connection failed:', error);
    }
  }

  public async hostGame(): Promise<void> {
    this.gameMode = 'multiplayer';
    this.isHosting = true;

    const connectionStatus = document.getElementById('connectionStatus');
    if (connectionStatus) {
      connectionStatus.textContent = 'SERVIDOR INICIADO!';
    }

    this.engine.startLevel(1);

    setTimeout(() => {
      document.getElementById('multiplayerMenu')!.style.display = 'none';
      document.getElementById('hud')!.style.display = 'block';
    }, 1000);
  }

  public getGameMode(): string {
    return this.gameMode;
  }

  public isMultiplayer(): boolean {
    return this.gameMode === 'multiplayer';
  }

  public getGameStats() {
    return {
      ...this.gameStats,
      timeSurvived: (Date.now() - this.gameStats.startTime) / 1000,
      score: this.gameStats.kills * 100
    };
  }

  public recordKill(): void {
    this.gameStats.kills++;
  }

  public disconnect(): void {
    if (this.network) {
      this.network.disconnect();
    }
  }
}
