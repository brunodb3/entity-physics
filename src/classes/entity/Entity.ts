import { Kinematics } from "@classes";
import { Vector3 } from "three";

export class Entity {
  public id: string;
  public kinematics: Kinematics;
  public runningMultiplier: number;
  public direction: "left" | "right";
  public position: { x: number; y: number };

  constructor(
    id: string,
    options?: {
      runningMultiplier?: number;
      minVelocity?: number;
      maxVelocity?: number;
      acceleration?: number;
      frictionMultiplier?: number;
    }
  ) {
    this.id = id;
    this.direction = "right";
    this.position = { x: 0, y: 0 };
    this.runningMultiplier = options?.runningMultiplier || 1.5;

    this.kinematics = new Kinematics({
      minVelocity: options?.minVelocity,
      maxVelocity: options?.maxVelocity,
      acceleration: options?.acceleration,
      frictionMultiplier: options?.frictionMultiplier,
    });
  }

  public tick(delta: number): void {
    const { velocity } = this.kinematics;

    this.position.x += velocity.x * delta;
    this.position.y += -velocity.y * delta;

    this.direction = "right";
    if (velocity.x < 0) {
      this.direction = "left";
    }
  }

  public addForce(
    force: { x: number; y: number; z?: number },
    running?: boolean
  ): void {
    const forceVector = new Vector3(force.x, force.y, force.z || 0);

    if (running) forceVector.multiplyScalar(this.runningMultiplier);

    this.kinematics.addForce(forceVector);
  }
}
