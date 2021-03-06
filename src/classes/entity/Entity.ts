import Victor from "victor";

import { Kinematics } from "@classes";
import { IEntity } from "@interfaces";

export class Entity {
  public id: string;
  public mass: number;
  public width: number;
  public height: number;
  public anchor: number;
  public kinematics: Kinematics;
  public movementMultiplier: number;
  public direction: "left" | "right";
  public position: { x: number; y: number };
  public type: "ghost" | "static" | "kinematic";
  // ? Axis-Aligned Bounding Box
  public aabb: { min: { x: number; y: number }; max: { x: number; y: number } };
  public animation: {
    frame: number;
    speed: number;
    name: string;
  };

  constructor(
    id: string,
    options?: {
      mass?: number;
      width?: number;
      height?: number;
      anchor?: number;
      minVelocity?: number;
      maxVelocity?: number;
      acceleration?: number;
      frictionMultiplier?: number;
      movementMultiplier?: number;
      position?: { x?: number; y?: number };
      type?: "ghost" | "static" | "kinematic";
      animation?: {
        frame?: number;
        speed?: number;
        name?: string;
      };
    }
  ) {
    this.id = id;
    this.direction = "right";
    this.mass = options?.mass || 1;
    this.anchor = options?.anchor || 1;
    this.type = options?.type || "ghost";
    this.movementMultiplier = options?.movementMultiplier || 1;
    this.position = {
      x: options?.position?.x || 0,
      y: options?.position?.y || 0,
    };
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

    this.width = options?.width || 0;
    this.height = options?.height || 0;

    this.aabb = this.getAABB();
  }

  public tick(delta: number): void {
    const { velocity } = this.kinematics;

    this.position.x += velocity.x * delta * this.movementMultiplier;
    this.position.y += velocity.y * delta * this.movementMultiplier;

    if (velocity.x < 0) {
      this.direction = "left";
    }

    if (velocity.x > 0) {
      this.direction = "right";
    }

    this.aabb = this.getAABB();
  }

  public addForce(force: { x: number; y: number }): void {
    const forceVector = new Victor(force.x, force.y);

    this.kinematics.addForce(forceVector);
  }

  public toJSON(): IEntity {
    return {
      id: this.id,
      anchor: this.anchor,
      direction: this.direction,
      movementMultiplier: this.movementMultiplier,
      animation: {
        frame: this.animation.frame,
        speed: this.animation.speed,
        name: this.animation.name,
      },
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      velocity: {
        x: this.kinematics.velocity.x,
        y: this.kinematics.velocity.y,
      },
      aabb: {
        min: this.aabb.min,
        max: this.aabb.max,
      },
      boundingBox: {
        topLeftX: this.aabb.min.x,
        topLeftY: this.aabb.min.y, // ? PixiJS inverts the Y axis
        width: this.aabb.max.x - this.aabb.min.x,
        height: this.aabb.max.y - this.aabb.min.y,
      },
    };
  }

  public getAABB() {
    return {
      min: {
        x: this.position.x - this.width * this.anchor,
        y: this.position.y - this.height * this.anchor,
      },
      max: {
        x: this.position.x + this.width * this.anchor,
        y: this.position.y + this.height * this.anchor,
      },
    };
  }
}
