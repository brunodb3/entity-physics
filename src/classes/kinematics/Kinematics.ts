import { Vector3 } from "three";

export class Kinematics {
  public velocity: Vector3;
  public minVelocity: number;
  public maxVelocity: number;
  public acceleration: number;
  public frictionMultiplier: number;

  constructor(options?: {
    minVelocity?: number;
    maxVelocity?: number;
    acceleration?: number;
    frictionMultiplier?: number;
  }) {
    this.velocity = new Vector3(0, 0, 0);
    this.minVelocity = options?.minVelocity || 0.5;
    this.maxVelocity = options?.maxVelocity || 9.5;
    this.acceleration = options?.acceleration || 0.7;
    this.frictionMultiplier = options?.frictionMultiplier || 0.9;
  }

  public addForce(force: Vector3): void {
    force.multiplyScalar(this.acceleration);

    this.velocity.add(force);
    this.velocity.multiplyScalar(this.frictionMultiplier);

    if (this.velocity.length() > this.maxVelocity) {
      this.velocity.normalize();
      this.velocity.multiplyScalar(this.maxVelocity);
    }

    if (this.velocity.length() < this.minVelocity) {
      this.velocity.setScalar(0);
    }
  }
}
