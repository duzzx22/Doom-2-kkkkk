// MathHelpers.ts - Math utility functions
import { Vector3, Euler, Quaternion } from 'three';

export class MathHelpers {
  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Linear interpolation
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * this.clamp(t, 0, 1);
  }

  /**
   * Vector3 lerp
   */
  static lerpVector(start: Vector3, end: Vector3, t: number): Vector3 {
    return new Vector3(
      this.lerp(start.x, end.x, t),
      this.lerp(start.y, end.y, t),
      this.lerp(start.z, end.z, t)
    );
  }

  /**
   * Smooth step
   */
  static smoothstep(min: number, max: number, t: number): number {
    const x = this.clamp((t - min) / (max - min), 0, 1);
    return x * x * (3 - 2 * x);
  }

  /**
   * Distance between two Vector3 points
   */
  static distance(a: Vector3, b: Vector3): number {
    return a.distanceTo(b);
  }

  /**
   * Random range
   */
  static randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Random Vector3 in sphere
   */
  static randomVector3InSphere(radius: number = 1): Vector3 {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = Math.cbrt(Math.random()) * radius;

    return new Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }

  /**
   * Rotate vector around axis
   */
  static rotateAroundAxis(vector: Vector3, axis: Vector3, angle: number): Vector3 {
    const quat = new Quaternion();
    quat.setFromAxisAngle(axis.normalize(), angle);
    return vector.applyQuaternion(quat);
  }
}
