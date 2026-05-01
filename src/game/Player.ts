// Player.ts - Player controller with weapons and movement
import * as THREE from 'three';
import { InputState } from './InputManager';
import { AudioManager } from './AudioManager';

interface Bullet {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mesh: THREE.Object3D;
  damage: number;
  life: number;
  maxLife: number;
}

interface Weapon {
  name: string;
  damage: number;
  fireRate: number;
  ammo: number;
  maxAmmo: number;
  reloadTime: number;
  spread: number;
}

export class Player {
  public camera: THREE.PerspectiveCamera;
  private audioManager: AudioManager;
  
  // Movement
  public position: THREE.Vector3 = new THREE.Vector3(0, 1.6, 0);
  private velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private moveSpeed: number = 16; // Fast arcade-style movement
  private sprintMultiplier: number = 1.5;
  private jumpForce: number = 8;
  private gravity: number = -28; // Increased gravity for snappier feel
  private isJumping: boolean = false;
  private isDucking: boolean = false;
  private crouchHeight: number = 0.8;
  private normalHeight: number = 1.6;
  
  // Health and status
  public health: number = 100;
  public maxHealth: number = 100;
  public currentAmmo: number = 30;
  public maxAmmo: number = 180;
  public armor: number = 0;
  
  // Weapons
  public currentWeaponIndex: number = 0;
  public currentWeapon: string = 'Revolver';
  private weapons: Map<string, Weapon> = new Map();
  private lastShotTime: number = 0;
  
  public autoFire: boolean = false;
  
  // Combat
  public bullets: Bullet[] = [];
  private muzzleFlashTime: number = 0;
  private cameraRecoil: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  
  // Input
  private camRotationX: number = 0;
  private camRotationY: number = 0;
  private mouseSpeedX: number = 0.003;
  private mouseSpeedY: number = 0.003;
  
  // Ground detection
  private groundRaycast: THREE.Raycaster;
  private isOnGround: boolean = true;

  constructor(camera: THREE.PerspectiveCamera, audioManager: AudioManager) {
    this.camera = camera;
    this.audioManager = audioManager;
    
    this.groundRaycast = new THREE.Raycaster();
    this.groundRaycast.ray.direction.y = -1;
    
    this.initializeWeapons();
  }

  private initializeWeapons(): void {
    this.weapons.set('Revolver', {
      name: 'Revolver',
      damage: 25,
      fireRate: 0.3,
      ammo: 30,
      maxAmmo: 180,
      reloadTime: 1.5,
      spread: 0.02
    });

    this.weapons.set('Shotgun', {
      name: 'Shotgun',
      damage: 60,
      fireRate: 0.7,
      ammo: 8,
      maxAmmo: 48,
      reloadTime: 2,
      spread: 0.1
    });

    this.weapons.set('Tesla Coil', {
      name: 'Tesla Coil',
      damage: 40,
      fireRate: 0.5,
      ammo: 20,
      maxAmmo: 100,
      reloadTime: 1.8,
      spread: 0.15
    });

    this.currentWeapon = 'Revolver';
  }

  public update(deltaTime: number, input: InputState, scene: THREE.Scene): void {
    // Update camera look
    this.updateCameraLook(input);
    
    // Update movement
    this.updateMovement(deltaTime, input);
    
    // Update weapon firing
    this.updateWeapon(deltaTime, input, scene);
    
    // Update bullets
    this.updateBullets(deltaTime, scene);
    
    // Update recoil
    this.muzzleFlashTime = Math.max(0, this.muzzleFlashTime - deltaTime);
    this.cameraRecoil.multiplyScalar(0.95);

    // Ground detection
    this.checkGroundCollision(scene);
  }

  private updateCameraLook(input: InputState): void {
    // Mouse/touch/gyro looking
    this.camRotationY -= input.mouseDelta.x * this.mouseSpeedX;
    this.camRotationX -= input.mouseDelta.y * this.mouseSpeedY;
    
    // Clamp vertical look
    this.camRotationX = THREE.MathUtils.clamp(
      this.camRotationX,
      -Math.PI / 2.2,
      Math.PI / 2.2
    );
    
    // Apply rotation to camera
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.camRotationY;
    this.camera.rotation.x = this.camRotationX;
    
    // Apply camera recoil
    this.camera.position.y += this.cameraRecoil.y;
  }

  private updateMovement(deltaTime: number, input: InputState): void {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    right.crossVectors(this.camera.up, forward).normalize();
    
    // Calculate desired movement
    let targetVelocity = new THREE.Vector3();
    
    if (input.forward) targetVelocity.add(forward);
    if (input.backward) targetVelocity.add(forward.multiplyScalar(-1));
    if (input.right) targetVelocity.add(right);
    if (input.left) targetVelocity.add(right.multiplyScalar(-1));
    
    // Normalize and apply speed
    if (targetVelocity.length() > 0) {
      targetVelocity.normalize();
      const speed = this.moveSpeed * (input.crouch ? 0.5 : 1);
      targetVelocity.multiplyScalar(speed);
    }
    
    // Apply friction
    this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelocity.x, 0.15);
    this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelocity.z, 0.15);
    
    // Apply gravity
    if (!this.isOnGround) {
      this.velocity.y += this.gravity * deltaTime;
    }
    
    // Handle jumping
    if (input.jump && this.isOnGround && !this.isDucking) {
      this.velocity.y = this.jumpForce;
      this.isJumping = true;
      this.isOnGround = false;
      this.audioManager.play('jump', 0.5);
    }
    
    // Handle crouching
    if (input.crouch) {
      if (!this.isDucking) {
        this.isDucking = true;
        this.position.y -= (this.normalHeight - this.crouchHeight) / 2;
      }
    } else {
      if (this.isDucking) {
        this.isDucking = false;
        this.position.y += (this.normalHeight - this.crouchHeight) / 2;
      }
    }
    
    // Update position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.camera.position.copy(this.position);
    
    // Clamp to level bounds
    this.position.x = THREE.MathUtils.clamp(this.position.x, -500, 500);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -500, 500);
  }

  private updateWeapon(deltaTime: number, input: InputState, scene: THREE.Scene): void {
    const weapon = this.weapons.get(this.currentWeapon);
    if (!weapon) return;
    
    this.lastShotTime += deltaTime;
    
    // Weapon switching
    if (input.mouseDelta.x > 0 && this.lastShotTime > 0.2) {
      this.switchWeapon(1);
      this.lastShotTime = 0;
    }
    if (input.mouseDelta.x < 0 && this.lastShotTime > 0.2) {
      this.switchWeapon(-1);
      this.lastShotTime = 0;
    }
    
    // Firing
    if ((input.shoot || this.autoFire) && weapon.ammo > 0) {
      if (this.lastShotTime >= weapon.fireRate) {
        this.fire(weapon, scene);
        this.lastShotTime = 0;
      }
    }
  }

  private fire(weapon: Weapon, scene: THREE.Scene): void {
    if (weapon.ammo <= 0) {
      this.audioManager.play('no_ammo', 0.5);
      return;
    }
    
    // Reduce ammo
    weapon.ammo--;
    this.currentAmmo = weapon.ammo;
    
    // Create muzzle flash
    this.muzzleFlashTime = 0.05;
    this.audioManager.play('shot', 0.7);
    
    // Add camera recoil
    this.cameraRecoil.y = -0.02;
    this.cameraRecoil.x = (Math.random() - 0.5) * 0.03;
    
    // Fire bullets
    const numBullets = weapon.name === 'Shotgun' ? 8 : 1;
    
    for (let i = 0; i < numBullets; i++) {
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      
      // Add spread
      const spread = weapon.spread * (Math.random() - 0.5) * 2;
      direction.applyAxisAngle(this.camera.up, spread);
      direction.applyAxisAngle(new THREE.Vector3().crossVectors(this.camera.up, direction), spread);
      
      const bullet: Bullet = {
        position: this.camera.position.clone().add(direction.clone().multiplyScalar(0.5)),
        velocity: direction.multiplyScalar(100),
        mesh: this.createBulletMesh(),
        damage: weapon.damage,
        life: 5,
        maxLife: 5
      };
      
      scene.add(bullet.mesh);
      this.bullets.push(bullet);
    }
  }

  private createBulletMesh(): THREE.Object3D {
    const geometry = new THREE.SphereGeometry(0.1, 4, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      shininess: 100
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
  }

  private updateBullets(deltaTime: number, scene: THREE.Scene): void {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.life -= deltaTime;
      
      if (bullet.life <= 0) {
        scene.remove(bullet.mesh);
        return false;
      }
      
      // Update position
      bullet.position.add(bullet.velocity.clone().multiplyScalar(deltaTime));
      bullet.mesh.position.copy(bullet.position);
      
      return true;
    });
  }

  private checkGroundCollision(scene: THREE.Scene): void {
    this.groundRaycast.ray.origin.copy(this.position);
    this.groundRaycast.ray.origin.y += 0.1;
    
    const intersects = this.groundRaycast.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const distance = intersects[0].distance;
      if (distance < 0.5) {
        this.isOnGround = true;
        this.velocity.y = Math.max(0, this.velocity.y);
        this.position.y = intersects[0].point.y + 0.1;
        this.isJumping = false;
      } else {
        this.isOnGround = false;
      }
    } else {
      this.isOnGround = false;
    }
  }

  private switchWeapon(direction: number): void {
    const weaponNames = Array.from(this.weapons.keys());
    this.currentWeaponIndex = (this.currentWeaponIndex + direction + weaponNames.length) % weaponNames.length;
    this.currentWeapon = weaponNames[this.currentWeaponIndex];
    this.audioManager.play('switch', 0.3);
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.audioManager.play('death', 0.8);
    }
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public addAmmo(amount: number): void {
    this.maxAmmo += amount;
    const weapon = this.weapons.get(this.currentWeapon);
    if (weapon) {
      weapon.ammo = Math.min(weapon.maxAmmo, weapon.ammo + amount);
    }
  }

  public reset(position: THREE.Vector3): void {
    this.health = this.maxHealth;
    this.position.copy(position);
    this.velocity.set(0, 0, 0);
    this.camRotationX = 0;
    this.camRotationY = 0;
    this.isOnGround = true;
    this.isDucking = false;
    this.bullets = [];
    this.currentWeaponIndex = 0;
    this.currentWeapon = 'Revolver';
    
    // Reset all weapons
    this.weapons.forEach(weapon => {
      weapon.ammo = weapon.maxAmmo;
    });
    
    this.camera.position.copy(position);
  }
}
