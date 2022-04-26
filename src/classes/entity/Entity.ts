import { Vector3 } from "three";

import { Kinematics } from "@classes";
import { IEntity } from "@interfaces";

export class Entity {
  public id: string;
  public kinematics: Kinematics;
  public runningMultiplier: number;
  public lastInputSequence: number;
  public direction: "left" | "right";
  public position: { x: number; y: number; z: number };

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
    this.lastInputSequence = 0;
    this.position = { x: 0, y: 0, z: 0 };
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
    this.position.y += velocity.y * delta;
    this.position.z += velocity.z * delta;

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

  public toJSON(): IEntity {
    return {
      id: this.id,
      direction: this.direction,
      lastInputSequence: this.lastInputSequence,
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      velocity: {
        x: this.kinematics.velocity.x,
        y: this.kinematics.velocity.y,
        z: this.kinematics.velocity.z,
      },
    };
  }
}
