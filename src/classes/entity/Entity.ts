import { Vector3 } from "three";

import { Kinematics } from "@classes";
import { IEntity } from "@interfaces";

export class Entity {
  public id: string;
  public type: string;
  public kinematics: Kinematics;
  public runningMultiplier: number;
  public lastInputSequence: number;
  public direction: "left" | "right";
  public position: { x: number; y: number; z: number };
  public animation: {
    frame: number;
    speed: number;
    name: string;
  };

  constructor(
    id: string,
    options?: {
      type?: string;
      runningMultiplier?: number;
      minVelocity?: number;
      maxVelocity?: number;
      acceleration?: number;
      frictionMultiplier?: number;
      animation?: {
        frame?: number;
        speed?: number;
        name?: string;
      };
    }
  ) {
    this.id = id;
    this.direction = "right";
    this.lastInputSequence = 0;
    this.position = { x: 0, y: 0, z: 0 };
    this.type = options?.type || "default";
    this.runningMultiplier = options?.runningMultiplier || 1.5;
    this.animation = {
      frame: options?.animation?.frame || 0,
      speed: options?.animation?.speed || 0,
      name: options?.animation?.name || "default",
    };

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

    if (velocity.x < 0) {
      this.direction = "left";
    }

    if (velocity.x > 0) {
      this.direction = "right";
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
      type: this.type,
      direction: this.direction,
      lastInputSequence: this.lastInputSequence,
      animation: {
        frame: this.animation.frame,
        speed: this.animation.speed,
        name: this.animation.name,
      },
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
