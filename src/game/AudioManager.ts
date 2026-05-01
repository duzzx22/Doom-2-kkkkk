// AudioManager.ts - Audio management and spatial sound
import { Howl } from 'howler';

export class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private masterVolume: number = 0.7;

  constructor() {
    this.initializeSounds();
    this.loadSettings();
  }

  private initializeSounds(): void {
    // Initialize placeholder sounds
    // In production, these would load actual audio files
    
    const soundConfig = {
      volume: this.masterVolume,
      preload: true
    };

    // Weapon sounds
    this.sounds.set('shot', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('reload', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('no_ammo', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    
    // Player sounds
    this.sounds.set('jump', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('land', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('hurt', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('death', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    
    // Enemy sounds
    this.sounds.set('zombie_groan', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('explosion', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('hit', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    
    // UI sounds
    this.sounds.set('click', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
    this.sounds.set('switch', new Howl({ src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='], ...soundConfig }));
  }

  public play(soundName: string, volume: number = 1): void {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume(volume * this.masterVolume);
      sound.play();
    }
  }

  public stop(soundName: string): void {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.stop();
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('gameVolume', (this.masterVolume * 100).toString());
  }

  private loadSettings(): void {
    const saved = localStorage.getItem('gameVolume');
    if (saved) {
      this.masterVolume = parseInt(saved) / 100;
    }
  }
}
