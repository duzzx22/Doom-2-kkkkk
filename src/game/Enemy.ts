// Enemy.ts - Enemy AI and behavior
import * as THREE from 'three';
import { Player } from './Player';

export enum EnemyType {
  Zombie = 'zombie',
  Golem = 'golem',
  Stalker = 'stalker'
}

enum EnemyState {
  Idle,
  Patrol,
  Chase,
  Attack,
  Flee,
  Dead
}

export class Enemy {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  private state: EnemyState = EnemyState.Idle;
  private type: EnemyType;
  
  // Health
  public health: number;
  public maxHealth: number;
  public isAlive: boolean = true;
  
  // Movement
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private moveSpeed: number;
  private detectionRange: number;
  private attackRange: number;
  
  // AI
  private targetPosition: THREE.Vector3 = new THREE.Vector3();
  private stateTimer: number = 0;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 1;
  
  // Animation
  private animationTime: number = 0;

  constructor(position: THREE.Vector3, levelDifficulty: number = 1) {
    this.position = position.clone();
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    
    // Determine enemy type based on random
    const rand = Math.random();
    if (rand < 0.6) {
      this.type = EnemyType.Zombie;
    } else if (rand < 0.9) {
      this.type = EnemyType.Golem;
    } else {
      this.type = EnemyType.Stalker;
    }
    
    this.initializeEnemy(levelDifficulty);
  }

  private initializeEnemy(difficulty: number): void {
    switch (this.type) {
      case EnemyType.Zombie:
        this.maxHealth = 30 + difficulty * 5;
        this.moveSpeed = 4;
        this.detectionRange = 100;
        this.attackRange = 2.5;
        this.createZombieMesh();
        break;
      case EnemyType.Golem:
        this.maxHealth = 60 + difficulty * 10;
        this.moveSpeed = 3;
        this.detectionRange = 150;
        this.attackRange = 3;
        this.createGolemMesh();
        break;
      case EnemyType.Stalker:
        this.maxHealth = 20 + difficulty * 4;
        this.moveSpeed = 8;
        this.detectionRange = 120;
        this.attackRange = 2;
        this.createStalkerMesh();
        break;
    }
    
    this.health = this.maxHealth;
    this.targetPosition.copy(this.position);
  }

  private createZombieMesh(): void {
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0x4a3728 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8;
    head.castShadow = true;
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x3d3d5c });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.2);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const leftLeg = new THREE.Mesh(legGeometry.clone(), legMaterial);
    leftLeg.position.set(-0.15, 0, 0);
    const rightLeg = new THREE.Mesh(legGeometry.clone(), legMaterial);
    rightLeg.position.set(0.15, 0, 0);
    
    this.mesh.add(head, body, leftLeg, rightLeg);
  }

  private createGolemMesh(): void {
    // Large mechanical construct
    const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const metalMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const head = new THREE.Mesh(headGeometry, metalMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.5);
    const body = new THREE.Mesh(bodyGeometry, metalMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    
    const armGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const leftArm = new THREE.Mesh(armGeometry, metalMaterial);
    leftArm.position.set(-0.4, 0.8, 0);
    const rightArm = new THREE.Mesh(armGeometry, metalMaterial);
    rightArm.position.set(0.4, 0.8, 0);
    
    this.mesh.add(head, body, leftArm, rightArm);
  }

  private createStalkerMesh(): void {
    // Dark, shadowy creature
    const bodyGeometry = new THREE.SphereGeometry(0.2, 6, 6);
    const darkMaterial = new THREE.MeshPhongMaterial({ color: 0x1a0000, emissive: 0x330000 });
    const body = new THREE.Mesh(bodyGeometry, darkMaterial);
    body.castShadow = true;
    
    // Eyes (glowing)
    const eyeGeometry = new THREE.SphereGeometry(0.05, 4, 4);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.05, 0.15);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.05, 0.15);
    
    this.mesh.add(body, leftEye, rightEye);
  }

  public update(deltaTime: number, playerPosition: THREE.Vector3, player: Player): void {
    if (!this.isAlive) return;
    
    this.animationTime += deltaTime;
    this.stateTimer -= deltaTime;
    this.lastAttackTime += deltaTime;
    
    // Update state based on player distance
    const distanceToPlayer = this.position.distanceTo(playerPosition);
    
    if (distanceToPlayer < this.detectionRange) {
      if (distanceToPlayer < this.attackRange) {
        this.state = EnemyState.Attack;
      } else {
        this.state = EnemyState.Chase;
      }
    } else {
      this.state = this.stateTimer > 0 ? this.state : EnemyState.Patrol;
    }
    
    // Execute state behavior
    switch (this.state) {
      case EnemyState.Patrol:
        this.patrol();
        break;
      case EnemyState.Chase:
        this.chase(playerPosition);
        break;
      case EnemyState.Attack:
        this.attack(player);
        break;
    }
    
    // Apply movement
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);
    
    // Look toward player if aware
    if (this.state !== EnemyState.Idle && this.state !== EnemyState.Patrol) {
      const direction = playerPosition.clone().sub(this.position);
      const angle = Math.atan2(direction.x, direction.z);
      this.mesh.rotation.y = angle;
    }
    
    // Apply simple bobbing animation
    this.mesh.position.y += Math.sin(this.animationTime * 3) * 0.01;
  }

  private patrol(): void {
    if (this.stateTimer <= 0) {
      // Choose new patrol point
      this.targetPosition.set(
        this.position.x + (Math.random() - 0.5) * 50,
        this.position.y,
        this.position.z + (Math.random() - 0.5) * 50
      );
      this.stateTimer = 5;
    }
    
    const direction = this.targetPosition.clone().sub(this.position);
    if (direction.length() > 1) {
      direction.normalize().multiplyScalar(this.moveSpeed * 0.5);
      this.velocity.copy(direction);
    } else {
      this.velocity.multiplyScalar(0.8);
    }
  }

  private chase(playerPosition: THREE.Vector3): void {
    const direction = playerPosition.clone().sub(this.position);
    if (direction.length() > 0.1) {
      direction.normalize().multiplyScalar(this.moveSpeed);
      this.velocity.lerp(direction, 0.2);
    }
    this.stateTimer = 0.5;
  }

  private attack(player: Player): void {
    if (this.lastAttackTime >= this.attackCooldown) {
      player.takeDamage(this.type === EnemyType.Golem ? 15 : 10);
      this.lastAttackTime = 0;
    }
    this.velocity.multiplyScalar(0.5);
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.isAlive = false;
    this.state = EnemyState.Dead;
  }
}
