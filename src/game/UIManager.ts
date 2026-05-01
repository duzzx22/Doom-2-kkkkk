// UIManager.ts - HUD and UI management
export class UIManager {
  private debugMode: boolean = false;

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.debugMode = localStorage.getItem('debugMode') === 'true';
  }

  public updateHUD(
    health: number,
    maxHealth: number,
    ammo: number,
    maxAmmo: number,
    weapon: string,
    fps: number
  ): void {
    // Update health
    const healthText = document.getElementById('healthText');
    const healthFill = document.getElementById('healthFill');
    if (healthText) {
      healthText.textContent = `SAÚDE: ${Math.ceil(health)}/${maxHealth}`;
    }
    if (healthFill) {
      const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
      (healthFill as HTMLElement).style.width = healthPercent + '%';
    }

    // Update ammo
    const ammoText = document.getElementById('ammoText');
    const weaponText = document.getElementById('weaponText');
    if (ammoText) {
      ammoText.textContent = `MUNIÇÃO: ${ammo}/${maxAmmo}`;
    }
    if (weaponText) {
      weaponText.textContent = weapon.toUpperCase();
    }

    // Update debug info if enabled
    if (this.debugMode) {
      const debugInfo = document.getElementById('debugInfo');
      if (debugInfo) {
        debugInfo.textContent = `FPS: ${fps} | Health: ${health.toFixed(0)} | Ammo: ${ammo}`;
      }
    }
  }

  public updateLevel(levelNumber: number): void {
    // Show level transition
    const hud = document.getElementById('hud');
    if (hud) {
      const levelDisplay = document.createElement('div');
      levelDisplay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Press Start 2P', cursive;
        font-size: 3rem;
        color: #ffd700;
        text-shadow: 0 0 20px #ffd700;
        pointer-events: none;
        z-index: 999;
      `;
      levelDisplay.textContent = `NÍVEL ${levelNumber}`;
      hud.appendChild(levelDisplay);

      setTimeout(() => {
        levelDisplay.remove();
      }, 2000);
    }
  }

  public showGameOver(stats: { kills: number; time: number; score: number }): void {
    const gameOverStats = document.getElementById('gameOverStats');
    if (gameOverStats) {
      gameOverStats.innerHTML = `
        <p>INIMIGOS DERROTADOS: ${stats.kills}</p>
        <p>TEMPO SOBREVIVIDO: ${Math.floor(stats.time)}s</p>
        <p>PONTUAÇÃO: ${stats.score}</p>
      `;
    }
  }

  public toggleDebugMode(): void {
    this.debugMode = !this.debugMode;
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
      debugInfo.style.display = this.debugMode ? 'block' : 'none';
    }
    localStorage.setItem('debugMode', this.debugMode.toString());
  }
}
