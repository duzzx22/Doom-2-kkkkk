// Engine.ts - Core Three.js game engine
import * as THREE from 'three';
import { InputManager } from './InputManager';
import { Player } from './Player';
import { AudioManager } from './AudioManager';
import { UIManager } from './UIManager';
import { LevelGenerator } from './LevelGenerator';
import { Enemy } from './Enemy';

export class Engine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  
  public inputManager: InputManager;
  public player: Player;
  public audioManager: AudioManager;
  public uiManager: UIManager;
  public levelGenerator: LevelGenerator;
  
  private enemies: Enemy[] = [];
  private gameLoop: number = 0;
  private lastFrameTime: number = 0;
  private frameCounter: number = 0;
  private fps: number = 0;
  
  public paused: boolean = false;
  public gameActive: boolean = false;
  
  private lights: THREE.Light[] = [];
  private levelObjects: THREE.Object3D[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Initialize Three.js
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      precision: 'highp'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 1;
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.008);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 0);
    
    // Initialize managers
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager();
    this.levelGenerator = new LevelGenerator(this.scene);
    
    // Create player
    this.player = new Player(this.camera, this.audioManager);
    
    // Setup lighting
    this.setupLighting();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  public async initialize(): Promise<void> {
    await this.inputManager.initialize();
    await this.levelGenerator.initialize();
  }

  private setupLighting(): void {
    // Ambient light (dim for atmosphere)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Add some key lights for atmosphere
    this.addAtmosphericLights();
  }

  private addAtmosphericLights(): void {
    // Gas lamp style lights scattered around
    for (let i = 0; i < 5; i++) {
      const light = new THREE.PointLight(0xffa500, 1, 50);
      light.position.set(
        Math.random() * 200 - 100,
        Math.random() * 40 + 5,
        Math.random() * 200 - 100
      );
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      this.scene.add(light);
      this.lights.push(light);
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Prevent context menu on right click
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Lock pointer on click
    this.canvas.addEventListener('click', () => {
      if (this.gameActive && !this.paused) {
        this.canvas.requestPointerLock();
      }
    });
  }

  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  public startLevel(levelNumber: number = 1): void {
    this.gameActive = true;
    this.paused = false;
    this.enemies = [];
    this.levelObjects = [];
    
    // Clear old objects
    const objectsToRemove: THREE.Object3D[] = [];
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj !== this.camera) {
        if (!this.lights.includes(obj as any)) {
          objectsToRemove.push(obj);
        }
      }
    });
    
    objectsToRemove.forEach(obj => this.scene.remove(obj));
    
    // Generate new level
    const levelData = this.levelGenerator.generateLevel(levelNumber);
    
    // Spawn player
    this.player.reset(levelData.spawnPoint);
    
    // Spawn enemies
    const numEnemies = Math.min(5 + levelNumber * 2, 20);
    for (let i = 0; i < numEnemies; i++) {
      const spawnPoint = levelData.enemySpawnPoints[i % levelData.enemySpawnPoints.length];
      const enemy = new Enemy(spawnPoint, levelNumber);
      this.scene.add(enemy.mesh);
      this.enemies.push(enemy);
    }
    
    // Add items to scene
    levelData.items.forEach(item => {
      this.scene.add(item.mesh);
    });
    
    // Update UI
    this.uiManager.updateLevel(levelNumber);
  }

  public start(): void {
    this.lastFrameTime = performance.now();
    this.gameLoop = requestAnimationFrame(() => this.update());
  }

  public stop(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
    }
  }

  private update = (): void => {
    const now = performance.now();
    const deltaTime = Math.min((now - this.lastFrameTime) / 1000, 0.016); // Cap at 60 FPS
    this.lastFrameTime = now;
    
    // Update FPS
    this.frameCounter++;
    if (this.frameCounter >= 60) {
      this.fps = Math.round(1 / deltaTime);
      this.frameCounter = 0;
    }
    
    if (this.gameActive && !this.paused) {
      // Update input
      const input = this.inputManager.update();
      
      // Update player
      this.player.update(deltaTime, input, this.scene);
      
      // Update enemies
      this.enemies = this.enemies.filter(enemy => {
        enemy.update(deltaTime, this.player.camera.position, this.player);
        return enemy.isAlive;
      });
      
      // Check collisions
      this.checkCollisions();
      
      // Update camera
      this.camera.position.copy(this.player.camera.position);
      this.camera.quaternion.copy(this.player.camera.quaternion);
      
      // Update UI
      this.uiManager.updateHUD(
        this.player.health,
        this.player.maxHealth,
        this.player.currentAmmo,
        this.player.maxAmmo,
        this.player.currentWeapon,
        this.fps
      );
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
    
    // Continue loop
    this.gameLoop = requestAnimationFrame(() => this.update());
  };

  private checkCollisions(): void {
    // Check player-enemy collisions
    this.enemies.forEach(enemy => {
      const distance = this.player.camera.position.distanceTo(enemy.position);
      if (distance < 2) {
        this.player.takeDamage(5);
        this.audioManager.play('hit', 0.3);
      }
    });
    
    // Check bullet-enemy collisions
    this.player.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach(enemy => {
        const distance = bullet.position.distanceTo(enemy.position);
        if (distance < 1.5) {
          enemy.takeDamage(bullet.damage);
          this.player.bullets.splice(bulletIndex, 1);
          this.scene.remove(bullet.mesh);
          
          if (!enemy.isAlive) {
            this.scene.remove(enemy.mesh);
            this.audioManager.play('explosion', 0.5);
          }
        }
      });
    });
  }

  public resetGame(): void {
    this.gameActive = false;
    this.paused = false;
    this.enemies = [];
    this.player.reset(new THREE.Vector3(0, 1.6, 0));
  }

  // Getters
  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public getFPS(): number {
    return this.fps;
  }
}
