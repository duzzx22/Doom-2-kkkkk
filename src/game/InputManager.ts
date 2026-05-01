// InputManager.ts - Handles keyboard, mouse, and touch input
import { Vector2 } from 'three';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  shoot: boolean;
  crouch: boolean;
  mouseDelta: Vector2;
  touchTilt?: Vector2;
}

export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mouseDown: boolean = false;
  private mouseDelta: Vector2 = new Vector2(0, 0);
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private isMobile: boolean = false;
  private isPointerLocked: boolean = false;
  private touchLeftStart: Vector2 = new Vector2(0, 0);
  private touchRightStart: Vector2 = new Vector2(0, 0);
  private touchLeftCurrent: Vector2 = new Vector2(0, 0);
  private touchRightCurrent: Vector2 = new Vector2(0, 0);
  private touchJoystickRadius: number = 60;
  
  public enableGyro: boolean = false;
  private alpha: number = 0;
  private beta: number = 0;
  private gamma: number = 0;

  public async initialize(): Promise<void> {
    this.detectDevice();
    this.setupKeyboardListeners();
    this.setupMouseListeners();
    this.setupTouchListeners();
    this.setupDeviceOrientation();
  }

  private detectDevice(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    if (this.isMobile) {
      const touchControls = document.getElementById('touchControls');
      if (touchControls) {
        touchControls.style.display = 'block';
      }
    }
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.keys.set(event.key.toLowerCase(), true);
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keys.set(event.key.toLowerCase(), false);
    });

    // Also handle WASD and arrow keys specifically
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') this.keys.set('w', true);
      if (key === 'a') this.keys.set('a', true);
      if (key === 's') this.keys.set('s', true);
      if (key === 'd') this.keys.set('d', true);
      if (key === ' ') this.keys.set('space', true);
      if (key === 'control') this.keys.set('control', true);
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') this.keys.set('w', false);
      if (key === 'a') this.keys.set('a', false);
      if (key === 's') this.keys.set('s', false);
      if (key === 'd') this.keys.set('d', false);
      if (key === ' ') this.keys.set('space', false);
      if (key === 'control') this.keys.set('control', false);
    });
  }

  private setupMouseListeners(): void {
    document.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 0) {
        this.mouseDown = true;
      }
    });

    document.addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button === 0) {
        this.mouseDown = false;
      }
    });

    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (document.pointerLockElement === document.body || 
          document.pointerLockElement === document.documentElement) {
        this.mouseDelta.x = event.movementX;
        this.mouseDelta.y = event.movementY;
        this.isPointerLocked = true;
      } else {
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement !== null;
    });

    // Mouse wheel for weapon switching
    document.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        this.keys.set('nextWeapon', true);
      } else if (event.deltaY < 0) {
        this.keys.set('prevWeapon', true);
      }
      setTimeout(() => {
        this.keys.set('nextWeapon', false);
        this.keys.set('prevWeapon', false);
      }, 100);
    }, { passive: false });
  }

  private setupTouchListeners(): void {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    // Fire button
    const fireButton = document.getElementById('fireButton');
    const jumpButton = document.getElementById('jumpButton');

    fireButton?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.keys.set('shoot', true);
    });
    fireButton?.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.set('shoot', false);
    });

    jumpButton?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.keys.set('space', true);
    });
    jumpButton?.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.set('space', false);
    });

    // Joystick touch events
    const leftJoystick = document.getElementById('leftJoystick');
    const rightJoystick = document.getElementById('rightJoystick');

    if (leftJoystick) {
      leftJoystick.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = leftJoystick.getBoundingClientRect();
        this.touchLeftStart.x = touch.clientX - rect.left;
        this.touchLeftStart.y = touch.clientY - rect.top;
      });

      leftJoystick.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = leftJoystick.getBoundingClientRect();
        this.touchLeftCurrent.x = touch.clientX - rect.left;
        this.touchLeftCurrent.y = touch.clientY - rect.top;
      });

      leftJoystick.addEventListener('touchend', () => {
        this.touchLeftCurrent.x = this.touchLeftStart.x;
        this.touchLeftCurrent.y = this.touchLeftStart.y;
      });
    }

    if (rightJoystick) {
      rightJoystick.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = rightJoystick.getBoundingClientRect();
        this.touchRightStart.x = touch.clientX - rect.left;
        this.touchRightStart.y = touch.clientY - rect.top;
      });

      rightJoystick.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = rightJoystick.getBoundingClientRect();
        this.touchRightCurrent.x = touch.clientX - rect.left;
        this.touchRightCurrent.y = touch.clientY - rect.top;
      });

      rightJoystick.addEventListener('touchend', () => {
        this.touchRightCurrent.x = this.touchRightStart.x;
        this.touchRightCurrent.y = this.touchRightStart.y;
      });
    }

    // Prevent scrolling on mobile
    document.addEventListener('touchmove', (e) => {
      if (this.isMobile) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  private setupDeviceOrientation(): void {
    if ('DeviceOrientationEvent' in window && this.isMobile) {
      window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
        this.alpha = event.alpha || 0; // Z axis
        this.beta = event.beta || 0;   // X axis
        this.gamma = event.gamma || 0; // Y axis
      });
    }
  }

  public update(): InputState {
    // Reset mouse delta
    const mouseDelta = this.mouseDelta.clone();
    this.mouseDelta.set(0, 0);

    // Get touch movement
    let touchTilt: Vector2 | undefined;
    if (this.isMobile) {
      const leftDelta = this.touchLeftCurrent.clone().sub(this.touchLeftStart);
      const rightDelta = this.touchRightCurrent.clone().sub(this.touchRightStart);

      // Left joystick for movement input
      if (leftDelta.length() > 0.1) {
        leftDelta.normalize();
      }

      // Right joystick for looking
      if (rightDelta.length() > 0.1) {
        mouseDelta.copy(rightDelta.multiplyScalar(2));
        rightDelta.normalize();
      }

      touchTilt = rightDelta;
    }

    // Gyro input (if mobile and enabled)
    if (this.isMobile && this.enableGyro) {
      // Use gamma (left-right) and beta (up-down) for looking
      mouseDelta.x += this.gamma * 2;
      mouseDelta.y += this.beta * 2;
    }

    return {
      forward: this.keys.get('w') || this.keys.get('arrowup') || false,
      backward: this.keys.get('s') || this.keys.get('arrowdown') || false,
      left: this.keys.get('a') || this.keys.get('arrowleft') || false,
      right: this.keys.get('d') || this.keys.get('arrowright') || false,
      jump: this.keys.get('space') || false,
      shoot: this.keys.get('shoot') || this.mouseDown || false,
      crouch: this.keys.get('control') || false,
      mouseDelta: mouseDelta,
      touchTilt: touchTilt
    };
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key.toLowerCase()) || false;
  }

  public getMousePosition(): Vector2 {
    return new Vector2(this.lastMouseX, this.lastMouseY);
  }
}
