// StorageManager.ts - Local storage management
export class StorageManager {
  private static readonly STORAGE_PREFIX = 'ironepoch_';

  /**
   * Save high score
   */
  static saveHighScore(score: number, level: number): void {
    const key = `${this.STORAGE_PREFIX}highscore`;
    const currentHigh = parseInt(localStorage.getItem(key) || '0');
    if (score > currentHigh) {
      localStorage.setItem(key, score.toString());
      localStorage.setItem(`${key}_level`, level.toString());
      localStorage.setItem(`${key}_date`, new Date().toISOString());
    }
  }

  /**
   * Get high score
   */
  static getHighScore(): { score: number; level: number; date: string } {
    return {
      score: parseInt(localStorage.getItem(`${this.STORAGE_PREFIX}highscore`) || '0'),
      level: parseInt(localStorage.getItem(`${this.STORAGE_PREFIX}highscore_level`) || '1'),
      date: localStorage.getItem(`${this.STORAGE_PREFIX}highscore_date`) || 'Never'
    };
  }

  /**
   * Save game settings
   */
  static saveSettings(settings: any): void {
    localStorage.setItem(
      `${this.STORAGE_PREFIX}settings`,
      JSON.stringify(settings)
    );
  }

  /**
   * Load game settings
   */
  static loadSettings(): any {
    const settings = localStorage.getItem(`${this.STORAGE_PREFIX}settings`);
    return settings ? JSON.parse(settings) : {};
  }

  /**
   * Save game progress
   */
  static saveProgress(level: number, health: number, ammo: number): void {
    localStorage.setItem(
      `${this.STORAGE_PREFIX}progress`,
      JSON.stringify({ level, health, ammo, timestamp: Date.now() })
    );
  }

  /**
   * Load game progress
   */
  static loadProgress(): any {
    const progress = localStorage.getItem(`${this.STORAGE_PREFIX}progress`);
    return progress ? JSON.parse(progress) : null;
  }

  /**
   * Clear all game data
   */
  static clearAll(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Export save file
   */
  static exportSave(): string {
    const data: any = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    });
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import save file
   */
  static importSave(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      return true;
    } catch {
      return false;
    }
  }
}
