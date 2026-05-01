// LevelGenerator.ts - Procedural level generation
import * as THREE from 'three';

export interface LevelData {
  spawnPoint: THREE.Vector3;
  enemySpawnPoints: THREE.Vector3[];
  items: any[];
  levelNumber: number;
}

export class LevelGenerator {
  private scene: THREE.Scene;
  private gridSize: number = 16;
  private cellSize: number = 10;
  private wallHeight: number = 3;
  private textureCache: Map<string, THREE.Texture> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public async initialize(): Promise<void> {
    // Pre-load textures if needed
    await this.preloadTextures();
  }

  private async preloadTextures(): Promise<void> {
    // Create procedural textures
    this.createProceduralTexture('brick', 0x8b6f47);
    this.createProceduralTexture('metal', 0x808080);
    this.createProceduralTexture('stone', 0x696969);
  }

  private createProceduralTexture(name: string, color: number): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill base color
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise pattern
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 40 - 20;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.textureCache.set(name, texture);
  }

  public generateLevel(levelNumber: number): LevelData {
    const levelData: LevelData = {
      spawnPoint: new THREE.Vector3(0, 2, 0),
      enemySpawnPoints: [],
      items: [],
      levelNumber
    };

    // Generate level based on difficulty
    const complexity = Math.min(levelNumber * 0.5, 3);

    // Create walls
    this.generateLayout(levelData, complexity);

    // Add ground
    this.addGround();

    // Add ceiling
    this.addCeiling();

    // Add atmosphere
    this.addAtmosphericElements();

    return levelData;
  }

  private generateLayout(levelData: LevelData, complexity: number): void {
    const gridData: boolean[][] = [];
    
    // Initialize grid
    for (let x = 0; x < this.gridSize; x++) {
      gridData[x] = [];
      for (let z = 0; z < this.gridSize; z++) {
        // Create basic wall pattern
        const distFromCenter = Math.abs(x - this.gridSize / 2) + Math.abs(z - this.gridSize / 2);
        gridData[x][z] = distFromCenter < 3 || (Math.random() < complexity * 0.1 && distFromCenter > 5);
      }
    }

    // Spawn point
    levelData.spawnPoint.set(0, 2, 0);

    // Enemy spawn points
    for (let i = 0; i < 5 + levelData.levelNumber * 2; i++) {
      const x = Math.floor(Math.random() * (this.gridSize - 4)) + 2;
      const z = Math.floor(Math.random() * (this.gridSize - 4)) + 2;
      
      if (!gridData[x][z]) {
        levelData.enemySpawnPoints.push(
          new THREE.Vector3(
            (x - this.gridSize / 2) * this.cellSize,
            2,
            (z - this.gridSize / 2) * this.cellSize
          )
        );
      }
    }

    // Create walls from grid
    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        if (gridData[x][z]) {
          this.createWall(
            (x - this.gridSize / 2) * this.cellSize,
            (z - this.gridSize / 2) * this.cellSize
          );
        }
      }
    }
  }

  private createWall(x: number, z: number): void {
    const wallGeometry = new THREE.BoxGeometry(this.cellSize * 0.9, this.wallHeight, this.cellSize * 0.9);
    const brickTexture = this.textureCache.get('brick');
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b6f47,
      map: brickTexture,
      shininess: 20
    });
    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, this.wallHeight / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    this.scene.add(wall);
  }

  private addGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(this.gridSize * this.cellSize * 2, this.gridSize * this.cellSize * 2);
    groundGeometry.rotateX(-Math.PI / 2);
    
    const stoneTexture = this.textureCache.get('stone');
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x3d3d3d,
      map: stoneTexture,
      shininess: 0
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private addCeiling(): void {
    const ceilingGeometry = new THREE.PlaneGeometry(this.gridSize * this.cellSize * 2, this.gridSize * this.cellSize * 2);
    ceilingGeometry.rotateX(Math.PI / 2);
    
    const ceilingMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a2a2a,
      shininess: 5
    });
    
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = this.wallHeight;
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);
  }

  private addAtmosphericElements(): void {
    // Add some pillars and crates for cover
    for (let i = 0; i < 8; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      const crateGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const crateMaterial = new THREE.MeshPhongMaterial({ color: 0x6b4423 });
      const crate = new THREE.Mesh(crateGeometry, crateMaterial);
      crate.position.set(x, 0.75, z);
      crate.castShadow = true;
      crate.receiveShadow = true;
      this.scene.add(crate);
    }

    // Add hanging chains
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      const chainGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 4);
      const chainMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
      const chain = new THREE.Mesh(chainGeometry, chainMaterial);
      chain.position.set(x, 1, z);
      chain.castShadow = true;
      this.scene.add(chain);
    }
  }
}
